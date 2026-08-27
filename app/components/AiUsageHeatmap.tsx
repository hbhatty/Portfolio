"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import styles from "./AiUsageHeatmap.module.css";

const USAGE_ENDPOINT =
  "https://usage-worker.harshbhatty2.workers.dev/api/usage";
const HISTORY_DAYS = 366;
const TORONTO_TIME_ZONE = "America/Toronto";
const TRACKING_STARTED_ON = "2026-08-20";
const MODES = ["daily", "weekly"] as const;

type UsageDay = {
  date: string;
  totalTokens: number;
  peakHour: number | null;
};

type UsageMode = (typeof MODES)[number];
type LoadState = "loading" | "ready" | "error";

type UsageWeek = {
  dates: string[];
  totalTokens: number;
  trackedDays: number;
  recordedDays: number;
};

type TooltipContent = {
  label: string;
  value: string;
  detail?: string;
};

type TooltipState = TooltipContent & {
  left: number;
  top: number;
  placement: "above" | "below";
};

const modeLabels: Record<UsageMode, string> = {
  daily: "Daily",
  weekly: "Weekly",
};

const fullNumberFormatter = new Intl.NumberFormat("en-CA");
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeZone: TORONTO_TIME_ZONE,
});
const monthFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  timeZone: TORONTO_TIME_ZONE,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTokenCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(value + "T00:00:00Z");
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function parseUsageResponse(value: unknown): UsageDay[] {
  if (
    !isRecord(value) ||
    !Array.isArray(value.days) ||
    value.days.length > HISTORY_DAYS
  ) {
    throw new Error("Usage response is outside the public history contract");
  }

  const seenDates = new Set<string>();
  return value.days.map((candidate) => {
    if (
      !isRecord(candidate) ||
      !isCalendarDate(candidate.date) ||
      !isTokenCount(candidate.totalTokens) ||
      (candidate.peakHour !== null &&
        (!Number.isSafeInteger(candidate.peakHour) ||
          Number(candidate.peakHour) < 0 ||
          Number(candidate.peakHour) > 23))
    ) {
      throw new Error("Usage response contains an invalid day");
    }

    const totalTokens = Number(candidate.totalTokens);
    const peakHour =
      candidate.peakHour === null ? null : Number(candidate.peakHour);
    const isZeroDay = totalTokens === 0;
    if (
      (isZeroDay && peakHour !== null) ||
      (!isZeroDay && peakHour === null) ||
      seenDates.has(candidate.date)
    ) {
      throw new Error("Usage response contains inconsistent daily data");
    }
    seenDates.add(candidate.date);

    return {
      date: candidate.date,
      totalTokens,
      peakHour,
    };
  });
}

function getTorontoDate(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to determine the current Toronto date");
  }
  return year + "-" + month + "-" + day;
}

function shiftDate(date: string, days: number): string {
  const value = new Date(date + "T00:00:00Z");
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function formatDate(date: string): string {
  return dateFormatter.format(new Date(date + "T12:00:00Z"));
}

function formatDateRange(dates: string[]): string {
  if (dates.length === 1) return formatDate(dates[0]);
  return formatDate(dates[0]) + " – " + formatDate(dates[dates.length - 1]);
}

function formatPeakHour(hour: number): string {
  const normalized = hour % 24;
  if (normalized === 0) return "12:00 AM";
  if (normalized === 12) return "12:00 PM";
  if (normalized < 12) return normalized + ":00 AM";
  return normalized - 12 + ":00 PM";
}

function getStateClass(
  state: "not-tracked" | "not-recorded" | "recorded",
  totalTokens: number,
  maximum: number,
): string {
  if (state === "not-tracked") {
    return "[border-color:rgba(255,255,255,0.015)] bg-white/[0.045]";
  }

  if (state === "not-recorded") {
    return "border-zinc-700/70 bg-zinc-900/70";
  }

  if (totalTokens === 0 || maximum === 0) {
    return "border-[#4a413b] bg-[#2c2724]";
  }

  const ratio = totalTokens / maximum;
  if (ratio <= 0.05) return "border-transparent bg-[#4b2114]";
  if (ratio <= 0.25) return "border-transparent bg-[#8f371f]";
  if (ratio <= 0.55) return "border-transparent bg-[#d95732]";
  return "border-transparent bg-[#ff7a59]";
}

function getWaveStyle(index: number): CSSProperties {
  return { "--wave-index": index } as CSSProperties;
}

function getNextMode(mode: UsageMode): UsageMode {
  const index = MODES.indexOf(mode);
  return MODES[(index + 1) % MODES.length];
}

function getDailyTooltip(
  date: string,
  usage: UsageDay | undefined,
): TooltipContent {
  const label = formatDate(date);
  if (date < TRACKING_STARTED_ON) {
    return {
      label,
      value: "Not tracked",
      detail: "Tracking began " + formatDate(TRACKING_STARTED_ON),
    };
  }
  if (!usage) {
    return {
      label,
      value: "Not recorded",
      detail: "No aggregate was stored",
    };
  }
  if (usage.totalTokens === 0) {
    return {
      label,
      value: "0 tokens",
      detail: "Recorded zero",
    };
  }

  return {
    label,
    value: fullNumberFormatter.format(usage.totalTokens) + " tokens",
    detail: "Estimated peak · " + formatPeakHour(usage.peakHour as number),
  };
}

function getWeeklyTooltip(week: UsageWeek): TooltipContent {
  if (week.trackedDays === 0) {
    return {
      label: formatDateRange(week.dates),
      value: "Not tracked",
      detail: "Tracking began " + formatDate(TRACKING_STARTED_ON),
    };
  }

  if (week.recordedDays === 0) {
    return {
      label: formatDateRange(week.dates),
      value: "Not recorded",
      detail: "No aggregate was stored",
    };
  }

  return {
    label: formatDateRange(week.dates),
    value: fullNumberFormatter.format(week.totalTokens) + " tokens",
    detail: week.totalTokens === 0 ? "Recorded zero" : undefined,
  };
}

function describeTooltip(content: TooltipContent): string {
  return [content.label, content.value, content.detail]
    .filter(Boolean)
    .join(": ");
}

export default function AiUsageHeatmap() {
  const today = useMemo(getTorontoDate, []);
  const { dates, cells, weekCount, monthLabels } = useMemo(() => {
    const dates = Array.from({ length: HISTORY_DAYS }, (_, index) =>
        shiftDate(today, index - (HISTORY_DAYS - 1)),
      );
    const leadingDays = new Date(dates[0] + "T00:00:00Z").getUTCDay();
    const cells = [
      ...Array.from({ length: leadingDays }, () => null),
      ...dates,
    ];
    const labels: Array<{ column: number; label: string }> = [];

    dates.forEach((date, index) => {
      if (!date.endsWith("-01")) return;

      const column = Math.floor((leadingDays + index) / 7) + 1;
      const label = monthFormatter.format(new Date(date + "T12:00:00Z"));
      if (labels.at(-1)?.column === column) {
        labels[labels.length - 1] = { column, label };
      } else {
        labels.push({ column, label });
      }
    });

    return {
      dates,
      cells,
      weekCount: Math.ceil(cells.length / 7),
      monthLabels: labels,
    };
  }, [today]);

  const [mode, setMode] = useState<UsageMode>("daily");
  const [outgoingMode, setOutgoingMode] = useState<UsageMode | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [usageByDate, setUsageByDate] = useState<Map<string, UsageDay>>(
    () => new Map(),
  );
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const transitionTimer = useRef<number | null>(null);

  const { weeks, dailyMaximum, weeklyMaximum } = useMemo(() => {
    const weeks: UsageWeek[] = [];
    for (let index = 0; index < cells.length; index += 7) {
      const weekDates = cells
        .slice(index, index + 7)
        .filter((date): date is string => date !== null);
      const recordedUsage = weekDates
        .map((date) => usageByDate.get(date))
        .filter((usage): usage is UsageDay => usage !== undefined);

      weeks.push({
        dates: weekDates,
        totalTokens: recordedUsage.reduce(
          (total, usage) => total + usage.totalTokens,
          0,
        ),
        trackedDays: weekDates.filter((date) => date >= TRACKING_STARTED_ON)
          .length,
        recordedDays: recordedUsage.length,
      });
    }

    return {
      weeks,
      dailyMaximum: Math.max(
        0,
        ...Array.from(usageByDate.values(), (day) => day.totalTokens),
      ),
      weeklyMaximum: Math.max(
        0,
        ...weeks.map((week) => week.totalTokens),
      ),
    };
  }, [cells, usageByDate]);

  const nextMode = getNextMode(mode);

  function showTooltip(
    target: HTMLElement,
    content: TooltipContent,
  ) {
    const bounds = target.getBoundingClientRect();
    const halfWidth = Math.min(125, (window.innerWidth - 24) / 2);
    const center = bounds.left + bounds.width / 2;
    const left = Math.max(
      12 + halfWidth,
      Math.min(window.innerWidth - 12 - halfWidth, center),
    );
    const placement = bounds.top < 96 ? "below" : "above";

    setTooltip({
      ...content,
      left,
      top: placement === "below" ? bounds.bottom + 6 : bounds.top - 6,
      placement,
    });
  }

  function cycleMode() {
    setTooltip(null);
    setOutgoingMode(mode);
    setMode(getNextMode(mode));

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }
    transitionTimer.current = window.setTimeout(() => {
      setOutgoingMode(null);
      transitionTimer.current = null;
    }, 350);
  }

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    let disposed = false;

    async function loadUsage() {
      try {
        const response = await fetch(USAGE_ENDPOINT, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Usage request failed with HTTP " + response.status);
        }

        const days = parseUsageResponse(await response.json())
          .filter((day) => day.date >= dates[0] && day.date <= today)
          .sort((left, right) => left.date.localeCompare(right.date));
        if (disposed) return;

        setUsageByDate(new Map(days.map((day) => [day.date, day])));
        setLoadState("ready");
      } catch {
        if (!disposed) setLoadState("error");
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadUsage();
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [dates, today]);

  useEffect(() => {
    const hideTooltip = () => setTooltip(null);
    window.addEventListener("resize", hideTooltip);
    window.addEventListener("scroll", hideTooltip, true);

    return () => {
      window.removeEventListener("resize", hideTooltip);
      window.removeEventListener("scroll", hideTooltip, true);
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  function renderMonthLabels() {
    return (
      <div
        className="mt-[0.65rem] grid w-max gap-x-[3px] overflow-visible text-[0.625rem] leading-none text-zinc-600"
        style={{
          gridTemplateColumns: "repeat(" + weekCount + ", 8px)",
        }}
        aria-hidden="true"
      >
        {monthLabels.map(({ column, label }) => (
          <span
            key={column + "-" + label}
            className="w-max"
            style={{ gridColumnStart: column }}
          >
            {label}
          </span>
        ))}
      </div>
    );
  }

  function renderCalendar() {
    return (
      <div
        className="grid w-max grid-flow-col auto-cols-[8px] grid-rows-[repeat(7,8px)] gap-[3px]"
        aria-label="Daily AI token usage for the last 366 Toronto calendar days"
      >
        {cells.map((date, index) => {
          if (date === null) {
            return (
              <span
                key={"leading-" + index}
                className={
                  styles.placeholder +
                  " block size-2 box-border rounded-[1px]"
                }
                style={getWaveStyle(Math.floor(index / 7))}
                aria-hidden="true"
              />
            );
          }

          const usage = usageByDate.get(date);
          const value = usage?.totalTokens ?? 0;
          const state = usage
            ? "recorded"
            : date < TRACKING_STARTED_ON
              ? "not-tracked"
              : "not-recorded";
          const stateClass = getStateClass(
            state,
            value,
            dailyMaximum,
          );
          const content = getDailyTooltip(date, usage);

          return (
            <span
              key={date}
              className={
                styles.cell +
                " block size-2 box-border rounded-[1px] border " +
                "cursor-crosshair transition-[background-color,border-color,transform] " +
                "duration-[160ms] hover:z-[1] hover:scale-[1.18] hover:outline " +
                "hover:outline-1 hover:outline-offset-1 hover:outline-zinc-300 " +
                "motion-reduce:transition-none " +
                stateClass
              }
              role="img"
              aria-label={describeTooltip(content)}
              style={getWaveStyle(Math.floor(index / 7))}
              onPointerEnter={(event) =>
                showTooltip(event.currentTarget, content)
              }
              onPointerLeave={() => setTooltip(null)}
              onClick={(event) => showTooltip(event.currentTarget, content)}
            />
          );
        })}
      </div>
    );
  }

  function renderWeekly() {
    return (
      <div
        className="grid h-[74px] w-max gap-x-[3px]"
        style={{
          gridTemplateColumns: "repeat(" + weekCount + ", 8px)",
        }}
        aria-label="Weekly AI token usage across the last 366 Toronto calendar days"
      >
        {weeks.map((week, index) => {
          const content = getWeeklyTooltip(week);
          const state =
            week.recordedDays > 0
              ? "recorded"
              : week.trackedDays === 0
                ? "not-tracked"
                : "not-recorded";
          const stateClass = getStateClass(
            state,
            week.totalTokens,
            weeklyMaximum,
          );
          const isIncomplete =
            week.recordedDays > 0 && week.recordedDays < week.trackedDays;

          return (
            <span
              key={week.dates[0]}
              className={
                styles.week +
                " relative block h-[74px] w-2 box-border rounded-[1px] border " +
                "cursor-crosshair transition-[background-color,border-color,transform] " +
                "duration-[160ms] hover:z-[1] hover:scale-y-[1.04] hover:outline " +
                "hover:outline-1 hover:outline-offset-1 hover:outline-zinc-300 " +
                "motion-reduce:transition-none " +
                stateClass
              }
              role="img"
              aria-label={describeTooltip(content)}
              style={getWaveStyle(index)}
              onPointerEnter={(event) =>
                showTooltip(event.currentTarget, content)
              }
              onPointerLeave={() => setTooltip(null)}
              onClick={(event) => showTooltip(event.currentTarget, content)}
            >
              {isIncomplete && (
                <span
                  className="pointer-events-none absolute inset-x-px bottom-px h-0.5 rounded-[1px] bg-zinc-100/60"
                  aria-hidden="true"
                />
              )}
            </span>
          );
        })}
      </div>
    );
  }

  function renderMode(view: UsageMode) {
    return view === "weekly" ? renderWeekly() : renderCalendar();
  }

  const statusMessage =
    loadState === "loading"
      ? "Loading token activity…"
      : loadState === "error"
        ? "Token activity is unavailable."
        : null;

  return (
    <section id="ai-usage" aria-labelledby="ai-usage-heading">
      <div className="flex items-center gap-[0.45rem] text-zinc-300">
        <svg
          className="mr-px size-4 shrink-0 text-zinc-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" />
          <path d="M15 6h1v4" />
          <path d="m6.134 14.768.866-.5 2 3.464" />
          <circle cx="16" cy="8" r="6" />
        </svg>
        <h2
          id="ai-usage-heading"
          className="m-0 text-sm font-medium tracking-[-0.01em]"
        >
          Token activity
        </h2>
        <span className="text-sm text-zinc-600" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          className="inline-grid appearance-none overflow-hidden border-0 bg-transparent p-0 text-sm text-zinc-600 transition-colors duration-[160ms] hover:text-zinc-400 disabled:cursor-default disabled:text-zinc-600 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-zinc-400 motion-reduce:transition-none"
          aria-controls="token-activity-chart"
          aria-label={
            modeLabels[mode] + " view. Switch to " + modeLabels[nextMode]
          }
          disabled={outgoingMode !== null}
          onClick={cycleMode}
        >
          <span className="col-start-1 row-start-1 inline-block" key={mode}>
            {modeLabels[mode]}
          </span>
        </button>
      </div>

      {statusMessage && (
        <div
          className="mt-4 flex min-h-25 items-center font-mono text-[0.6875rem] text-zinc-600"
          role="status"
        >
          {statusMessage}
        </div>
      )}

      {loadState === "ready" && (
        <div className="mt-4 overflow-x-auto py-0.5 pb-2 [scrollbar-color:#3f3f46_transparent] [scrollbar-width:thin]">
          <div id="token-activity-chart" className="w-max min-w-full">
            <div className="relative isolate h-[74px] w-max">
              {outgoingMode && (
                <div
                  className={
                    styles.outgoing +
                    " " +
                    (outgoingMode === "weekly" ? styles.weekly : "") +
                    " w-max"
                  }
                  key={"outgoing-" + outgoingMode + "-" + mode}
                  aria-hidden="true"
                  inert
                >
                  {renderMode(outgoingMode)}
                </div>
              )}
              <div
                className={
                  styles.incoming +
                  " " +
                  (mode === "weekly" ? styles.weekly : "") +
                  " w-max"
                }
                key={mode}
              >
                {renderMode(mode)}
              </div>
            </div>
            {renderMonthLabels()}
          </div>
        </div>
      )}

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 block w-max max-w-[calc(100vw-24px)] rounded-[0.3rem] border border-white/[0.08] bg-[rgba(24,21,19,0.98)] px-[0.55rem] py-[0.45rem] shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
          role="tooltip"
          style={{
            left: tooltip.left,
            top: tooltip.top,
            transform:
              tooltip.placement === "below"
                ? "translate(-50%, 0)"
                : "translate(-50%, -100%)",
          }}
        >
          <strong className="block font-mono text-[0.6875rem] font-medium leading-[1.25] text-zinc-100">
            {tooltip.value}
          </strong>
          <div className="mt-[0.18rem] flex flex-wrap items-baseline gap-1">
            <span className="font-mono text-[0.5625rem] leading-[1.35] text-zinc-400">
              {tooltip.label}
            </span>
            {tooltip.detail && (
              <>
                <span
                  className="font-mono text-[0.5625rem] leading-[1.35] text-zinc-600"
                  aria-hidden="true"
                >
                  ·
                </span>
                <span className="font-mono text-[0.5625rem] leading-[1.35] text-zinc-500">
                  {tooltip.detail}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
