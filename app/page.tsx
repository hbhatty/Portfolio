import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-slate-800 p-8 font-sans selection:bg-slate-200">
      <div className="max-w-2xl text-center space-y-8 relative z-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="relative inline-block mt-4 text-6xl"
            title="construction worker"
          >
            👷🏽‍♂️
          </div>

          <h1 className="text-3xl font-medium tracking-tight text-slate-900">
            v2 work in progress.
          </h1>
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            href="/v1"
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>view v1</span>
            <span className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
