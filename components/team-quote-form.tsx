"use client";

import { useState } from "react";
import { inputClass, labelClass, primaryButton } from "@/components/kit-options";

export default function TeamQuoteForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status" className="flex flex-col justify-center rounded-2xl border border-[#19c37d]/40 bg-[#19c37d]/10 p-8">
        <p className="font-display text-xl uppercase">Request received</p>
        <p className="mt-3 text-sm text-[#e7efee]/80">
          Our team kit manager will reply within 2 working days with a mock-up and quote.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: forward the request to email/CRM once a backend is in place
        setSent(true);
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <label className="block">
        <span className={labelClass}>Team / club name</span>
        <input name="team" required className={`${inputClass} mt-2`} />
      </label>
      <label className="block">
        <span className={labelClass}>Your name</span>
        <input name="contact" required autoComplete="name" className={`${inputClass} mt-2`} />
      </label>
      <label className="block">
        <span className={labelClass}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={`${inputClass} mt-2`} />
      </label>
      <label className="block">
        <span className={labelClass}>Number of kits</span>
        <input name="quantity" type="number" min={10} defaultValue={15} required className={`${inputClass} mt-2`} />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelClass}>Colours, deadline, anything else</span>
        <textarea name="message" rows={4} className={`${inputClass} mt-2 resize-y`} />
      </label>
      <button type="submit" className={`${primaryButton} sm:col-span-2`}>
        Send request
      </button>
    </form>
  );
}
