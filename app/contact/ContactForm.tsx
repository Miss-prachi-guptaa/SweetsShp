"use client";

import { useState } from "react";

const fieldClass = "mt-2 w-full rounded-xl border border-[#2B3447] bg-[#121823] px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-[#DAAE3C] focus:ring-2 focus:ring-[#DAAE3C]/15 disabled:opacity-60";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", requirement: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to submit your inquiry.");
      setStatus({ type: "success", message: "Thank you! Your message has been delivered to our Vindhyavaisini team." });
      setFormData({ name: "", phone: "", email: "", requirement: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Please try again or contact us on WhatsApp." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#243044] bg-[#0D1117] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#DAAE3C]">Send us a message</p>
      <h2 className="mt-2 text-3xl font-black text-white">How can we help?</h2>
      <p className="mt-3 text-sm leading-6 text-neutral-400">Share your custom cut, catering or restaurant supply requirement. Our team will get back to you shortly.</p>

      {status.type !== "idle" && (
        <div role="status" className={`mt-5 rounded-xl border px-4 py-3 text-sm ${status.type === "success" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-red-500/40 bg-red-500/10 text-red-300"}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-xs font-bold text-neutral-200">
          Your Name *
          <input type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Enter your full name" disabled={submitting} className={fieldClass} />
        </label>
        <label className="text-xs font-bold text-neutral-200">
          Phone / WhatsApp Number *
          <input type="tel" required pattern="[0-9 +()-]{10,15}" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="10-digit mobile number" disabled={submitting} className={fieldClass} />
        </label>
        <label className="text-xs font-bold text-neutral-200 sm:col-span-2">
          Email ID (Optional)
          <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="e.g. name@example.com" disabled={submitting} className={fieldClass} />
        </label>
        <label className="text-xs font-bold text-neutral-200 sm:col-span-2">
          Inquiry Type *
          <select required value={formData.requirement} onChange={(event) => setFormData({ ...formData, requirement: event.target.value })} disabled={submitting} className={fieldClass}>
            <option value="">Select an option</option>
            <option value="Mithai or snacks order">Mithai or snacks order</option>
            <option value="Custom cut request">Custom cut request</option>
            <option value="Bulk / catering order">Bulk / catering order</option>
            <option value="Restaurant supply">Restaurant supply</option>
            <option value="Delivery support">Delivery support</option>
            <option value="Other inquiry">Other inquiry</option>
          </select>
        </label>
        <label className="text-xs font-bold text-neutral-200 sm:col-span-2">
          Your Message *
          <textarea rows={5} required maxLength={500} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="What cuts, quantities or delivery help do you need?" disabled={submitting} className={fieldClass} />
          <span className="mt-1 block text-right text-[10px] font-normal text-neutral-600">{formData.message.length}/500</span>
        </label>
        <button type="submit" disabled={submitting} className="sm:col-span-2 rounded-xl bg-[#DAAE3C] px-5 py-3.5 text-sm font-black text-black shadow-[0_8px_24px_rgba(218, 174, 60,0.2)] transition hover:-translate-y-0.5 hover:bg-[#B58729] disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? "Sending Message..." : "Send Message  ➤"}
        </button>
      </form>
    </div>
  );
}
