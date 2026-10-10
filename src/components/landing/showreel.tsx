"use client";

import { useRef, useState } from "react";

export function Showreel({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  return (
    <div className="relative rounded-[var(--radius)] bg-[oklch(0.16_0.012_50)]">
      <video
        ref={videoRef}
        className="block aspect-[1920/1080] w-full bg-[oklch(0.16_0.012_50)] object-contain"
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        loop
        playsInline
      />
      <button
        type="button"
        className="absolute top-3 left-3 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          const next = !video.muted;
          video.muted = next;
          setMuted(next);
          if (!next) void video.play();
        }}
      >
        {muted ? "Play with sound" : "Mute"}
      </button>
    </div>
  );
}
