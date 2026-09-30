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
const MODES = ["daily", "weekly", "cumulative"] as const;

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
  cumulativeTokens: number;
  cumulativeTrackedDays: number;
  cumulativeRecordedDays: number;
  cumulativeIncomplete: boolean;
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
  cumulative: "Cumulative",
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
    return "border-neutral-700/70 bg-neutral-900/70";
  }

  if (totalTokens === 0 || maximum === 0) {
    return "border-neutral-700/80 bg-neutral-800/80";
  }

  const ratio = totalTokens / maximum;
  if (ratio <= 0.05) return "border-transparent bg-neutral-500";
  if (ratio <= 0.25) return "border-transparent bg-neutral-400";
  if (ratio <= 0.55) return "border-transparent bg-neutral-300";
  return "border-transparent bg-neutral-100";
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
  today: string,
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
    if (date === today) {
      return {
        label,
        value: "In progress",
      };
    }

    return {
      label,
      value: "No data",
      detail: "Usage wasn't recorded",
    };
  }
  if (usage.totalTokens === 0) {
    return {
      label,
      value: "0 tokens",
      detail: "No token activity",
    };
  }

  return {
    label,
    value: fullNumberFormatter.format(usage.totalTokens) + " tokens",
    detail: "Estimated peak · " + formatPeakHour(usage.peakHour as number),
  };
}

function getWeeklyTooltip(
  week: UsageWeek,
  mode: "weekly" | "cumulative",
): TooltipContent {
  const isCumulative = mode === "cumulative";
  const trackedDays = isCumulative
    ? week.cumulativeTrackedDays
    : week.trackedDays;
  const recordedDays = isCumulative
    ? week.cumulativeRecordedDays
    : week.recordedDays;
  const totalTokens = isCumulative
    ? week.cumulativeTokens
    : week.totalTokens;

  if (trackedDays === 0) {
    return {
      label: formatDateRange(week.dates),
      value: "Not tracked",
      detail: "Tracking began " + formatDate(TRACKING_STARTED_ON),
    };
  }

  if (recordedDays === 0) {
    return {
      label: formatDateRange(week.dates),
      value: "No data",
      detail: "Usage wasn't recorded",
    };
  }

  return {
    label: isCumulative
      ? "Through the week of " + formatDate(week.dates[0])
      : formatDateRange(week.dates),
    value: fullNumberFormatter.format(totalTokens) + " tokens",
    detail:
      isCumulative && week.cumulativeIncomplete
        ? "Incomplete data"
        : totalTokens === 0
          ? "No token activity"
          : undefined,
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

  const { weeks, dailyMaximum, weeklyMaximum, cumulativeMaximum } = useMemo(() => {
    const weeks: UsageWeek[] = [];
    let cumulativeTokens = 0;
    let cumulativeTrackedDays = 0;
    let cumulativeRecordedDays = 0;
    let cumulativeIncomplete = false;

    for (let index = 0; index < cells.length; index += 7) {
      const weekDates = cells
        .slice(index, index + 7)
        .filter((date): date is string => date !== null);
      const recordedUsage = weekDates
        .map((date) => usageByDate.get(date))
        .filter((usage): usage is UsageDay => usage !== undefined);
      const totalTokens = recordedUsage.reduce(
        (total, usage) => total + usage.totalTokens,
        0,
      );
      const trackedDays = weekDates.filter(
        (date) => date >= TRACKING_STARTED_ON,
      ).length;
      if (
        !weekDates.includes(today) &&
        recordedUsage.length < trackedDays
      ) {
        cumulativeIncomplete = true;
      }

      cumulativeTokens += totalTokens;
      cumulativeTrackedDays += trackedDays;
      cumulativeRecordedDays += recordedUsage.length;
      weeks.push({
        dates: weekDates,
        totalTokens,
        trackedDays,
        recordedDays: recordedUsage.length,
        cumulativeTokens,
        cumulativeTrackedDays,
        cumulativeRecordedDays,
        cumulativeIncomplete,
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
      cumulativeMaximum: weeks.at(-1)?.cumulativeTokens ?? 0,
    };
  }, [cells, today, usageByDate]);

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
    const targetMode = getNextMode(mode);
    setTooltip(null);
    setOutgoingMode(mode);
    setMode(targetMode);

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }
    transitionTimer.current = window.setTimeout(() => {
      setOutgoingMode(null);
      transitionTimer.current = null;
    }, targetMode === "daily" ? 180 : 350);
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
                className="block size-2 box-border rounded-[1px]"
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
          const content = getDailyTooltip(date, usage, today);

          return (
            <span
              key={date}
              className={
                "block size-2 box-border rounded-[1px] border " +
                "cursor-crosshair transition-[background-color,border-color,transform] " +
                "duration-[160ms] hover:z-[1] hover:scale-[1.18] hover:outline " +
                "hover:outline-1 hover:outline-offset-1 hover:outline-zinc-300 " +
                "motion-reduce:transition-none " +
                stateClass
              }
              role="img"
              aria-label={describeTooltip(content)}
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

  function renderWeekly(view: "weekly" | "cumulative") {
    const isCumulative = view === "cumulative";
    return (
      <div
        className="grid h-[74px] w-max gap-x-[3px]"
        style={{
          gridTemplateColumns: "repeat(" + weekCount + ", 8px)",
        }}
        aria-label={
          modeLabels[view] +
          " AI token usage across the last 366 Toronto calendar days"
        }
      >
        {weeks.map((week, index) => {
          const content = getWeeklyTooltip(week, view);
          const trackedDays = isCumulative
            ? week.cumulativeTrackedDays
            : week.trackedDays;
          const recordedDays = isCumulative
            ? week.cumulativeRecordedDays
            : week.recordedDays;
          const totalTokens = isCumulative
            ? week.cumulativeTokens
            : week.totalTokens;
          const maximum = isCumulative
            ? cumulativeMaximum
            : weeklyMaximum;
          const state =
            recordedDays > 0
              ? "recorded"
              : trackedDays === 0
                ? "not-tracked"
                : "not-recorded";
          const stateClass = getStateClass(state, totalTokens, maximum);
          const isIncomplete = isCumulative
            ? recordedDays > 0 && week.cumulativeIncomplete
            : recordedDays > 0 && recordedDays < trackedDays;

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
    return view === "daily" ? renderCalendar() : renderWeekly(view);
  }

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
          className="inline-grid cursor-pointer appearance-none overflow-hidden border-0 bg-transparent p-0 text-sm text-zinc-600 transition-colors duration-[160ms] hover:text-zinc-400 disabled:cursor-default disabled:text-zinc-600 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-zinc-400 motion-reduce:transition-none"
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
      <p className="ml-6 mt-1 text-[0.6875rem] italic leading-relaxed text-zinc-500">
        you can tell when the 5-hour limit came back
      </p>

      {loadState === "loading" && (
        <div
          className="mt-4 flex min-h-25 items-center justify-center"
          role="status"
        >
          <span
            className="size-4 animate-spin rounded-full border border-zinc-700 border-t-zinc-400 motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="sr-only">Loading token activity…</span>
        </div>
      )}

      {loadState === "error" && (
        <div
          className="mt-4 flex min-h-25 items-center font-mono text-[0.6875rem] text-zinc-600"
          role="status"
        >
          Token activity is unavailable.
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
                    (outgoingMode === "daily" ? "" : styles.weekly) +
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
                  (outgoingMode ? styles.incoming + " " : "") +
                  (mode === "daily" ? "" : styles.weekly) +
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
