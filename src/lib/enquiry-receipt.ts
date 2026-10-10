"use client";

import { useSyncExternalStore } from "react";

export type EnquiryReceipt = { href: string; reference: string };

const prefix = "pinhole-receipt:";
const eventName = "pinhole-receipt";

function keyFor(key: string) {
  return prefix + key;
}

function subscribe(onChange: () => void) {
  window.addEventListener(eventName, onChange);
  return () => window.removeEventListener(eventName, onChange);
}

function readRaw(key: string) {
  try {
    return sessionStorage.getItem(keyFor(key)) ?? "";
  } catch {
    return "";
  }
}

function parseReceipt(raw: string): EnquiryReceipt | undefined {
  if (!raw) return undefined;
  try {
    const value = JSON.parse(raw) as EnquiryReceipt;
    if (!value.href?.startsWith("https://wa.me/") || !value.reference) return undefined;
    return { href: value.href, reference: value.reference };
  } catch {
    return undefined;
  }
}

export function writeReceipt(key: string, receipt: EnquiryReceipt) {
  sessionStorage.setItem(keyFor(key), JSON.stringify(receipt));
  window.dispatchEvent(new Event(eventName));
}

export function clearReceipt(key: string) {
  sessionStorage.removeItem(keyFor(key));
  window.dispatchEvent(new Event(eventName));
}

export function useReceipt(key: string) {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => "");
  return parseReceipt(raw);
}
