"use client";

import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-lg shadow-sm transition hover:shadow-md"
      >
        {open ? "×" : "☰"}
      </button>

      {open && (
        <nav className="absolute right-0 top-14 z-50 w-48 rounded-2xl border border-black/10 bg-white p-3 shadow-lg">
          <a
            href="/about"
            className="block rounded-xl px-4 py-3 text-sm hover:bg-[#F0F8FF]"
          >
            About
          </a>

          <a
            href="/experience"
            className="block rounded-xl px-4 py-3 text-sm hover:bg-[#F0F8FF]"
          >
            Experience
          </a>

          <a
            href="/projects"
            className="block rounded-xl px-4 py-3 text-sm hover:bg-[#F0F8FF]"
          >
            Projects
          </a>

          <a
            href="/contact"
            className="block rounded-xl px-4 py-3 text-sm hover:bg-[#F0F8FF]"
          >
            Contact
          </a>
        </nav>
      )}
    </div>
  );
}