"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ANSWER = "ryan";
const STORAGE_KEY = "nameguesser.guesses.v1";

function normalizeGuess(value: string) {
  return value.trim().toLowerCase();
}

export default function Home() {
  const router = useRouter();

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const normalizedGuess = useMemo(() => normalizeGuess(guess), [guess]);
  const canSubmit = normalizedGuess.length > 0;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
        // Defer state update to avoid a synchronous setState inside an effect body.
        if (typeof queueMicrotask === "function") {
          queueMicrotask(() => setGuesses(parsed));
        } else {
          Promise.resolve().then(() => setGuesses(parsed));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guesses));
    } catch {
      // ignore
    }
  }, [guesses]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (!canSubmit) {
      setMessage("Type a name first.");
      return;
    }

    const displayGuess = guess.trim();
    const normalized = normalizeGuess(guess);
    setGuesses((prev) => [displayGuess, ...prev]);
    setGuess("");

    if (normalized === ANSWER) {
      router.push("/success");
    } else {
      setMessage("Nope — try again.");
    }
  }

  function clearHistory() {
    setGuesses([]);
    setMessage(null);
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white px-4 py-16 text-zinc-900 dark:from-zinc-950 dark:to-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold tracking-tight">
            Guess my name
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Type a name and press Enter. Unlimited tries.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Your guess…"
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-base outline-none ring-0 focus:border-zinc-400 dark:border-white/15 dark:bg-black dark:focus:border-white/25"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-11 shrink-0 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition-opacity disabled:opacity-40 dark:bg-white dark:text-black"
            >
              Guess
            </button>
          </form>

          {message ? (
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              {message}
            </p>
          ) : null}

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Your guesses
              </h2>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-zinc-600 underline-offset-4 hover:underline disabled:opacity-50 dark:text-zinc-400"
                disabled={guesses.length === 0}
              >
                Clear
              </button>
            </div>

            {guesses.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                Nothing yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {guesses.map((g, idx) => (
                  <li
                    key={`${idx}-${g}`}
                    className="rounded-xl border border-black/5 bg-zinc-50 px-4 py-2 text-sm text-zinc-800 line-through dark:border-white/10 dark:bg-black/30 dark:text-zinc-200"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs text-zinc-500 dark:text-zinc-500">
          Tip: the correct answer redirects you.
        </p>
      </main>
    </div>
  );
}
