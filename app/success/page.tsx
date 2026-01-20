import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white px-4 py-16 text-zinc-900 dark:from-emerald-950 dark:to-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold tracking-tight">You got it.</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            The name was <span className="font-semibold">Ryan</span>.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Back to guessing
          </Link>
        </div>
      </main>
    </div>
  );
}
