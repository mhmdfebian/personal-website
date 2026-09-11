"use client";

import { useEffect } from "react";

export function MediaCopyHandler() {
  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".copy-media-url");
    const handlers = Array.from(buttons, (button) => { const handler = () => navigator.clipboard.writeText(new URL(button.dataset.url ?? "", window.location.origin).toString()); button.addEventListener("click", handler); return [button, handler] as const; });
    return () => handlers.forEach(([button, handler]) => button.removeEventListener("click", handler));
  }, []);
  return null;
}