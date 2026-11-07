import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SHOP_ADDRESS, SHOP_MAP_URL, SHOP_PHONE_DISPLAY, SHOP_PHONE_E164 } from "@/lib/shop";

export const metadata: Metadata = {
  title: "About Us | Vindhyavaisini Mithai & Snacks",
  description: "Discover Vindhyavaisini's tradition of fresh mithai, savoury snacks and celebration gifting.",
};

const pillars = [
  { number: "01", icon: "🪔", title: "Traditional Recipes", text: "Time-honoured methods, balanced sweetness and the familiar flavours families love." },
  { number: "02", icon: "✨", title: "Fresh Daily Batches", text: "Mithai, jalebi and savoury snacks are prepared in fresh batches for better taste and texture." },
  { number: "03", icon: "🎁", title: "Made for Celebrations", text: "Curated boxes for pooja, festivals, weddings, birthdays and corporate gifting." },
];

const standards = ["Premium ingredients", "Fresh daily batches", "Hygienic preparation", "Celebration-ready packing"];

export default function AboutUsPage() {
  const mapQuery = encodeURIComponent(SHOP_ADDRESS);
  const directionsUrl = SHOP_MAP_URL;

  return (
    <div className="bg-[#120304] text-white">
      <div className="w-full px-3 py-5 sm:px-6 lg:px-10 xl:px-12">
        <section className="relative min-h-[520px] overflow-hidden rounded-2xl border border-[#242B38] shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:min-h-[580px] lg:min-h-[620px]">
          <Image src="/vindhyavaisini/mithai-hero.png" alt="Vindhyavaisini Indian mithai assortment" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070A] via-[#05070A]/95 to-[#05070A]/5 lg:via-[#05070A]/82 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070A]/80 via-transparent to-black/30" />
          <div className="relative z-10 flex min-h-[520px] max-w-2xl flex-col justify-center px-6 py-12 sm:min-h-[580px] sm:px-10 lg:min-h-[620px] lg:px-14">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-[#DAAE3C] sm:text-sm">Our heritage &amp; mission</p>
            <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl">The <span className="text-[#DAAE3C]">Vindhyavaisini</span> Story</h1>
            <p className="mt-5 max-w-xl text-xl font-semibold leading-snug text-neutral-100 sm:text-2xl">Ghosi ki parampara, mithaas aur mehmaan-nawaazi — ek hi jagah.</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">Vindhyavaisini brings together fresh Indian mithai, hot savoury snacks and thoughtfully packed gifts for everyday cravings and life’s biggest celebrations.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[#DAAE3C] px-6 py-3 text-sm font-black text-black shadow-[0_8px_24px_rgba(218, 174, 60,0.3)] transition hover:-translate-y-0.5 hover:bg-[#B58729]">Explore Our Menu <span aria-hidden="true">→</span></Link>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#DAAE3C]/60 bg-black/55 px-6 py-3 text-sm font-bold text-[#DAAE3C] backdrop-blur-md transition hover:bg-[#DAAE3C] hover:text-black">Get Directions</a>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 rounded-2xl border border-[#212838] bg-[#0D1117] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.32)] md:grid-cols-[1.2fr_0.8fr] md:p-9">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#DAAE3C]">Who we are</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Pure ingredients. Memorable taste.</h2>
            <p className="mt-5 text-sm leading-7 text-neutral-300 sm:text-base">Our menu honours familiar Indian flavours while keeping preparation, packing and service dependable. Choose a family favourite or let us build a custom box for your occasion.</p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {["Freshly prepared", "Carefully packed", "Made to celebrate"].map((item) => (
                <div key={item} className="rounded-xl border border-[#DAAE3C]/20 bg-black/25 px-4 py-4 text-sm font-bold text-neutral-100"><span className="mr-2 text-[#DAAE3C]">✓</span>{item}</div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-[#303849]">
            <Image src="/vindhyavaisini/mithai-hero.png" alt="Fresh Indian sweets" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover object-center" />
          </div>
        </section>

        <section className="py-10">
          <div className="mb-5 flex items-center gap-4"><h2 className="text-3xl font-black text-white">Our Core Pillars</h2><span className="h-1 w-16 rounded-full bg-[#DAAE3C]" /></div>
          <div className="grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.number} className="group rounded-2xl border border-[#31394A] bg-gradient-to-br from-[#111722] to-[#090C11] p-6 transition hover:-translate-y-1 hover:border-[#DAAE3C]/60 hover:shadow-[0_18px_45px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between"><span className="text-3xl font-black text-[#DAAE3C]">{pillar.number}</span><span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DAAE3C]/50 bg-[#DAAE3C]/10 text-2xl text-[#DAAE3C]">{pillar.icon}</span></div>
                <h3 className="mt-6 text-xl font-black text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-[#283143] bg-[#0B1018] p-6 sm:p-9">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 md:block">
            <Image src="/vindhyavaisini/mithai-hero.png" alt="Premium mithai" fill sizes="40vw" className="object-cover opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1018] via-[#0B1018]/70 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#DAAE3C]">Our quality promise</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Prepared with care, packed with pride</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-300 sm:text-base">We focus on fresh batches, premium ingredients and hygienic handling so every box reaches you looking beautiful and tasting delicious.</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {standards.map((standard) => <div key={standard} className="rounded-xl border border-[#DAAE3C]/25 bg-black/35 px-4 py-4 text-center text-xs font-bold text-neutral-100 backdrop-blur-sm"><span className="mb-2 block text-xl text-[#DAAE3C]">✓</span>{standard}</div>)}
            </div>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-[#243044] bg-[#0D1117] shadow-[0_20px_55px_rgba(0,0,0,0.38)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-6 sm:p-9 lg:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#DAAE3C]">Visit Vindhyavaisini</p>
              <h2 className="mt-2 text-3xl font-black text-white">Experience fresh quality in Ghosi</h2>
              <p className="mt-4 text-sm leading-7 text-neutral-400">Order fresh mithai and snacks or visit us to create a custom celebration box.</p>
              <address className="mt-6 space-y-4 text-sm not-italic text-neutral-200">
                <p><span className="mr-3 text-[#DAAE3C]">●</span>{SHOP_ADDRESS}</p>
                <p><span className="mr-3 text-[#DAAE3C]">✉</span><a className="hover:text-[#DAAE3C]" href="mailto:Utkarsh.221005@gmail.com">Utkarsh.221005@gmail.com</a></p>
                <p><span className="mr-3 text-[#DAAE3C]">☎</span><a className="hover:text-[#DAAE3C]" href={`tel:+${SHOP_PHONE_E164}`}>{SHOP_PHONE_DISPLAY}</a></p>
              </address>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`https://wa.me/${SHOP_PHONE_E164}?text=Namaste%20Vindhyavaisini!%20I%20would%20like%20to%20place%20an%20order.`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-[#20BD5A]">Order on WhatsApp</a>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#DAAE3C] px-5 py-3 text-sm font-bold text-[#DAAE3C] transition hover:bg-[#DAAE3C] hover:text-black">Get Directions</a>
              </div>
            </div>
            <div className="min-h-[360px] border-t border-[#243044] lg:border-l lg:border-t-0">
              <iframe title="Vindhyavaisini store location in Ghosi" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} className="h-full min-h-[360px] w-full border-0 grayscale-[15%] contrast-110" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
