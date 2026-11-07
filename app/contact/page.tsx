import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "./ContactForm";
import { WhatsAppIcon, PhoneIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact Us | Vindhyavaisini Mithai & Snacks",
  description: "Contact Vindhyavaisini for mithai, snacks, gift boxes and free delivery within 2 km in Ghosi, District Mau.",
};

const address = "Ghosi, Tehsil Ghosi, District Mau, Uttar Pradesh – 284128";

export default function ContactPage() {
  const mapQuery = encodeURIComponent("Ghosi Tehsil Ghosi District Mau Uttar Pradesh 284128");
  const directionsUrl = "https://maps.app.goo.gl/EvdvsGEQBiae8Pny9?g_st=ac";

  return (
    <div className="bg-[#07090E] text-white">
      <div className="w-full px-3 py-5 sm:px-6 lg:px-10 xl:px-12">
        <section className="relative min-h-[410px] overflow-hidden rounded-2xl border border-[#242B38] shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:min-h-[460px]">
          <Image src="/vindhyavaisini/mithai-hero.png" alt="Vindhyavaisini sweets and snacks" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070A] via-[#05070A]/94 to-[#05070A]/10 lg:via-[#05070A]/82 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
          <div className="relative z-10 flex min-h-[410px] max-w-3xl flex-col justify-center px-6 py-10 sm:min-h-[460px] sm:px-10 lg:px-14">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#DAAE3C]">Get in touch</p>
            <h1 className="mt-3 text-4xl font-black leading-none text-white sm:text-5xl lg:text-6xl">Contact <span className="text-[#DAAE3C]">VINDHYAVAISINI</span></h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-neutral-200 sm:text-xl">We are here to help with mithai orders, custom gift boxes, bulk requirements and delivery queries.</p>
            <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["⚡", "Fast response", "Quick support"],
                ["◉", "Dedicated team", "For all queries"],
                ["✓", "Free delivery", "Within 2 km"],
                ["♥", "Fresh & hygienic", "Always our priority"],
              ].map(([icon, title, subtitle]) => (
                <div key={title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-md">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DAAE3C]/60 text-[#DAAE3C]">{icon}</span>
                  <span><strong className="block text-xs text-white">{title}</strong><small className="text-[10px] text-neutral-400">{subtitle}</small></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-2xl border border-[#243044] bg-[#0D1117] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#DAAE3C]">Contact information</p>
            <h2 className="mt-2 text-3xl font-black text-white">Talk directly with our team</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-400">For orders, stock enquiries, custom cut photographs or bulk supply requirements, choose the channel that works best for you.</p>
            <div className="mt-6 divide-y divide-[#243044]">
              <ContactRow icon={<WhatsAppIcon size={24} color="#25D366" />} title="WhatsApp (Preferred)" description="Orders, stock enquiries and custom cut photos">
                <a href="https://wa.me/919264933232" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#DAAE3C] px-4 py-2 text-xs font-black text-black hover:bg-[#B58729]">Chat on WhatsApp →</a>
              </ContactRow>
              <ContactRow icon={<PhoneIcon size={22} color="#DAAE3C" />} title="Call Us" description="Direct line for delivery, dispatch and enquiries">
                <a href="tel:+919264933232" className="text-sm font-black text-[#DAAE3C] hover:text-white">+91 92649 33232</a>
              </ContactRow>
              <ContactRow icon={<span className="text-xl">✉</span>} title="Email Us" description="Official support and catering enquiries">
                <a href="mailto:Utkarsh.221005@gmail.com" className="text-sm font-black text-[#DAAE3C] hover:text-white">Utkarsh.221005@gmail.com</a>
              </ContactRow>
              <ContactRow icon={<span className="text-xl">●</span>} title="Store Address" description={address} />
              <ContactRow icon={<span className="text-xl">◷</span>} title="Operating Hours" description="7:00 AM – 9:00 PM · Open all 7 days" />
            </div>
            <div className="relative mt-6 min-h-[230px] overflow-hidden rounded-2xl border border-[#303849]">
              <Image src="/vindhyavaisini/mithai-hero.png" alt="Visit Vindhyavaisini for fresh mithai and snacks" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-xs flex-col justify-center p-6">
                <p className="text-2xl font-black text-white">Visit Our Store</p>
                <p className="mt-2 text-sm text-neutral-200">Fresh mithai and friendly service in Ghosi, District Mau.</p>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 w-fit rounded-full bg-[#DAAE3C] px-5 py-2.5 text-xs font-black text-black">Get Directions</a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ContactForm />
            <div className="overflow-hidden rounded-2xl border border-[#243044] bg-[#0D1117]">
              <div className="min-h-[330px]">
                <iframe title="Vindhyavaisini store location in Ghosi" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} className="h-[330px] w-full border-0 grayscale-[15%] contrast-110" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div className="flex flex-col gap-3 border-t border-[#243044] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-black text-white">VINDHYAVAISINI · Ghosi</p><p className="mt-1 text-xs text-neutral-400">{address}</p></div>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full border border-[#DAAE3C] px-4 py-2 text-xs font-bold text-[#DAAE3C] hover:bg-[#DAAE3C] hover:text-black">Open in Google Maps →</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactRow({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#DAAE3C]/45 bg-[#DAAE3C]/10 text-[#DAAE3C]">{icon}</span>
      <div className="min-w-0 flex-1"><h3 className="font-black text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-neutral-400">{description}</p></div>
      {children}
    </div>
  );
}
