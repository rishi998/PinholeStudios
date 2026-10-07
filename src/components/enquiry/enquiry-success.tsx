"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function EnquirySuccess({ href }: { href: string }) {
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid gap-3 rounded-3xl border border-border bg-card p-5" role="status">
      <p className="font-medium">Enquiry saved. Continue to WhatsApp{seconds > 0 ? ` in ${seconds}s` : ""}.</p>
      <Button nativeButton={false} variant="whatsapp" size="lg" render={<a href={href} target="_blank" rel="noopener noreferrer" />}>
        Continue to WhatsApp
      </Button>
    </div>
  );
}
