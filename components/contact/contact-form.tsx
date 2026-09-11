"use client";

import { useActionState, useEffect, useRef } from "react";

import { submitContactAction, type ContactActionState } from "@/app/(site)/contact/actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, {} as ContactActionState);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success]);

  return <form action={formAction} className="space-y-6" ref={formRef}><div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="website">Website</label><input autoComplete="off" id="website" name="website" tabIndex={-1} /></div><div className="grid gap-6 md:grid-cols-2"><label className="block text-sm font-medium" htmlFor="contact-name">Name<input autoComplete="name" className="mt-2 w-full border border-black/20 bg-white px-3 py-3 font-normal focus:border-black" id="contact-name" name="name" required /></label><label className="block text-sm font-medium" htmlFor="contact-email">Email<input autoComplete="email" className="mt-2 w-full border border-black/20 bg-white px-3 py-3 font-normal focus:border-black" id="contact-email" name="email" required type="email" /></label></div><label className="block text-sm font-medium" htmlFor="contact-subject">Subject<input className="mt-2 w-full border border-black/20 bg-white px-3 py-3 font-normal focus:border-black" id="contact-subject" maxLength={180} name="subject" required /></label><label className="block text-sm font-medium" htmlFor="contact-message">Message<textarea className="mt-2 min-h-48 w-full border border-black/20 bg-white px-3 py-3 font-normal focus:border-black" id="contact-message" maxLength={5000} minLength={10} name="message" required /></label>{state.error ? <p aria-live="polite" className="text-sm text-red-700">{state.error}</p> : null}{state.success ? <p aria-live="polite" className="border border-green-200 bg-green-50 p-4 text-sm text-green-800">{state.success}</p> : null}<button className="focus-ring bg-black px-5 py-3 font-medium text-white disabled:opacity-50" disabled={pending} type="submit">{pending ? "Sending..." : "Send message"}</button></form>;
}