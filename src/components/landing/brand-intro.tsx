"use client";

import { useEffect, useState } from "react";

const word = "Pinhole";
const storageKey = "pinhole-intro-seen";
let seenInThisTab = false;

function replayRequested() {
  return new URLSearchParams(window.location.search).get("intro") === "1";
}

function alreadySeen() {
  if (replayRequested()) return false;
  if (seenInThisTab) return true;
  try {
    return sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function unlockPage() {
  document.documentElement.classList.remove("pinhole-intro-lock");
}

function remember() {
  seenInThisTab = true;
  try {
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // Session storage can be blocked. The in-memory flag still covers this tab.
  }
  document.documentElement.dataset.pinholeIntro = "skip";
  unlockPage();
}

export function BrandIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (replayRequested()) delete document.documentElement.dataset.pinholeIntro;
    if (alreadySeen()) {
      document.documentElement.dataset.pinholeIntro = "skip";
      const hide = window.setTimeout(() => setActive(false), 0);
      return () => window.clearTimeout(hide);
    }

    const reduced =
      document.documentElement.dataset.pinholeMotion === "reduce" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("pinhole-intro-lock");
    const timer = window.setTimeout(() => {
      remember();
      setActive(false);
    }, reduced ? 650 : 2780);

    return () => {
      window.clearTimeout(timer);
      unlockPage();
    };
  }, []);

  if (!active) return null;

  return (
    <div className="pinhole-intro" role="dialog" aria-label="Pinhole">
      <p className="sr-only">Pinhole</p>
      <div className="w-fit max-w-[calc(100vw-2rem)] text-center">
        <p aria-hidden="true" className="pinhole-word">
          {word.split("").map((character, index) => (
            <span key={character + index} className="pinhole-char" style={{ ["--i" as string]: index }}>
              {character}
            </span>
          ))}
        </p>
        <span className="pinhole-line" aria-hidden="true" />
        <p aria-hidden="true" className="pinhole-caption">
          Studio · New Delhi
        </p>
      </div>
      <button
        type="button"
        className="pinhole-skip"
        onClick={() => {
          remember();
          setActive(false);
        }}
      >
        Skip intro
      </button>
    </div>
  );
}
