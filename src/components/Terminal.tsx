"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import type { TerminalCommand } from "@content/site";
import { HudPanel } from "./HudPanel";

type Props = {
  user: string;
  host: string;
  session: readonly TerminalCommand[];
};

/** How far the typing has progressed. */
type Pos = {
  /** Index into `session`. Equal to `session.length` when finished. */
  step: number;
  /** Characters of the current command typed so far. */
  chars: number;
  /** Output lines of the current command revealed so far. */
  lines: number;
};

const START: Pos = { step: 0, chars: 0, lines: 0 };

function jitter(base: number, spread: number) {
  return base + (Math.random() - 0.5) * spread;
}

/** Next position and how long to wait before showing it. */
function advance(pos: Pos, session: readonly TerminalCommand[]): { next: Pos; delay: number } {
  const cmd = session[pos.step];
  if (pos.chars < cmd.cmd.length) {
    // Typing the command at human speed.
    return { next: { ...pos, chars: pos.chars + 1 }, delay: jitter(58, 40) };
  }
  if (pos.lines < cmd.output.length) {
    // Output: a pause after Enter, then lines land quickly.
    const line = cmd.output[pos.lines];
    const delay =
      pos.lines === 0 ? 450 : Math.min(420, Math.max(60, line.length * 9));
    return { next: { ...pos, lines: pos.lines + 1 }, delay };
  }
  // Next prompt.
  return { next: { step: pos.step + 1, chars: 0, lines: 0 }, delay: 380 };
}

/**
 * Types a scripted shell session once on mount, then stays. No loop; a
 * page refresh restarts it. Click, tap or Enter skips to the end.
 */
export function Terminal({ user, host, session }: Props) {
  const [pos, setPos] = useState<Pos>(START);
  const done = pos.step >= session.length;
  const finished: Pos = { step: session.length, chars: 0, lines: 0 };

  useEffect(() => {
    if (done) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { next, delay } = reduce
      ? { next: finished, delay: 0 }
      : advance(pos, session);
    const t = window.setTimeout(() => setPos(next), delay);
    return () => window.clearTimeout(t);
    // `finished` is derived from `session`, which is stable content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, done, session]);

  const skip = () => {
    if (!done) setPos(finished);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      skip();
    }
  };

  const prompt = (
    <>
      <span className="text-teal">
        {user}@{host}
      </span>
      <span className="text-amber">:~$</span>{" "}
    </>
  );

  const renderSession = (p: Pos) => {
    const out: React.ReactNode[] = [];
    const isDone = p.step >= session.length;
    const lastStep = Math.min(p.step, session.length - 1);

    for (let i = 0; i <= lastStep; i++) {
      const c = session[i];
      const current = i === p.step && !isDone;
      const cmdText = current ? c.cmd.slice(0, p.chars) : c.cmd;
      const typingCmd = current && p.chars < c.cmd.length;
      const shownLines = current ? p.lines : c.output.length;

      out.push(
        <div
          key={`c${i}`}
          className={`term-line ${typingCmd ? "hud-cursor" : ""}`}
        >
          {prompt}
          <span className="text-fg">{cmdText}</span>
        </div>,
      );
      for (let j = 0; j < shownLines; j++) {
        const line = c.output[j];
        const isCursorLine = current && !typingCmd && j === shownLines - 1;
        out.push(
          <div
            key={`o${i}-${j}`}
            className={`term-line pl-4 text-fg/85 ${isCursorLine ? "hud-cursor" : ""}`}
          >
            {line}
          </div>,
        );
      }
      // Cursor sits on an empty line while waiting for the first output line.
      if (current && !typingCmd && shownLines === 0) {
        out.push(<div key={`w${i}`} className="term-line hud-cursor pl-4" />);
      }
    }

    if (isDone) {
      out.push(
        <div key="end" className="term-line hud-cursor">
          {prompt}
        </div>,
      );
    }
    return out;
  };

  return (
    <HudPanel
      as="div"
      className="cursor-text select-none"
      tabIndex={0}
      onClick={skip}
      onKeyDown={onKey}
      aria-label={`Terminal session for ${user}. ${done ? "" : "Press Enter to skip typing."}`}
    >
      <div className="term-title">
        <span className="flex items-center gap-2">
          <span aria-hidden className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
          </span>
          {user}@{host}: ~
        </span>
        <span
          aria-hidden
          className={`text-amber-dim transition-opacity ${done ? "opacity-0" : "opacity-100"}`}
        >
          [ skip ]
        </span>
      </div>
      <div className="term-body">
        {/* Finished session: reserves height and is what screen readers read. */}
        <div className="term-ghost">{renderSession(finished)}</div>
        {/* Animated layer */}
        <div className="term-live" aria-hidden>
          {renderSession(pos)}
        </div>
      </div>
    </HudPanel>
  );
}
