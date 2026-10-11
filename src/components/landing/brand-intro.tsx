"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { pinholeLogo } from "@/data/pinhole-media";

const word = "Pinhole";
let seenInThisTab = false;

function replayRequested() {
  return new URLSearchParams(window.location.search).get("intro") === "1";
}

function alreadySeen() {
  if (replayRequested()) return false;
  return seenInThisTab;
}

function unlockPage() {
  document.documentElement.classList.remove("pinhole-intro-lock");
}

function remember() {
  seenInThisTab = true;
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
    }, reduced ? 800 : 6600);

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
        <span className="pinhole-mark" aria-hidden="true">
          <Image src={pinholeLogo} alt="" width={600} height={320} className="pinhole-logo" priority />
        </span>
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
