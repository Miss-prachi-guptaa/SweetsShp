"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { HERO_BANNERS_DATA } from "@/data/heroBanners";
import { useCart } from "@/lib/CartContext";

const categories = [
  { name: "Traditional Sweets", subtext: "Gulab Jamun, Rasgulla, Jalebi", emoji: "🪔" },
  { name: "Barfi & Kaju", subtext: "Kaju Katli, Milk Cake, Kalakand", emoji: "◇" },
  { name: "Laddoo & Dry Sweets", subtext: "Motichoor, Besan, Soan Papdi", emoji: "🟠" },
  { name: "Bengali Sweets", subtext: "Rasmalai, Cham Cham, Sandesh", emoji: "🥣" },
  { name: "Snacks & Chaat", subtext: "Samosa, Kachori, Chana Chaat", emoji: "🥟" },
  { name: "Gift Boxes", subtext: "Festivals, Weddings & Pooja", emoji: "🎁" },
  { name: "Namkeen", subtext: "Mixture, Bhujia & Mathri", emoji: "🥨" },
  { name: "Beverages", subtext: "Cold Drinks, Lassi & Water", emoji: "🥤" },
];

export default function HomePage() {
  const { verifyPincode } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [active, setActive] = useState("All");
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<{ serviceable: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || d.data || [])).catch(() => setProducts([]));
  }, []);

  const visible = active === "All" ? products.slice(0, 8) : products.filter((p) => p.category === active).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#120304] text-white selection:bg-[#f1bf3a] selection:text-[#4b0609]">
      <div className="mx-auto w-full space-y-10 px-4 pb-16 pt-5 sm:px-6 lg:px-10 xl:px-12">
        <section aria-label="Vindhyavaisini highlights"><HeroCarousel banners={HERO_BANNERS_DATA} autoSlideInterval={5000} /></section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["✨", "Fresh Every Day", "Small batches, big flavour"],
            ["🪔", "Traditional Recipes", "Authentic desi taste"],
            ["🎁", "Custom Gift Boxes", "For every celebration"],
            ["🛵", "Quick Delivery", "Across selected areas"],
          ].map(([icon, title, text]) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-[#6e191d] bg-[#250708] p-4 shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f1bf3a]/10 text-xl">{icon}</span>
              <div><h3 className="text-sm font-black text-[#ffe49a]">{title}</h3><p className="text-xs text-[#c9a7a8]">{text}</p></div>
            </div>
          ))}
        </section>

        <section id="categories-section" className="space-y-5">
          <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#e6b63b]">Explore our menu</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Aaj kya khayenge?</h2></div><Link href="/products" className="text-sm font-bold text-[#f1bf3a]">See all →</Link></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`} className="group relative min-h-44 overflow-hidden rounded-2xl border border-[#6e191d] bg-gradient-to-br from-[#3a0a0c] to-[#190405] p-5 transition hover:-translate-y-1 hover:border-[#f1bf3a]">
                <div className="absolute -bottom-8 -right-5 text-[92px] opacity-15 transition group-hover:scale-110">{cat.emoji}</div>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-[#f1bf3a]/30 bg-[#f1bf3a]/10 text-2xl">{cat.emoji}</span>
                <h3 className="mt-5 text-base font-black text-[#fff2c8]">{cat.name}</h3><p className="mt-1 text-xs leading-5 text-[#c9a7a8]">{cat.subtext}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#6e191d] bg-[#250708] p-4 sm:p-5">
          <form onSubmit={(e) => { e.preventDefault(); if (pin) setPinResult(verifyPincode(pin)); }} className="flex flex-col gap-3 sm:flex-row">
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="Enter delivery PIN code" className="flex-1 rounded-xl border border-[#793036] bg-[#120304] px-4 py-3 text-sm outline-none focus:border-[#f1bf3a]" />
            <button className="rounded-xl bg-gradient-to-r from-[#f7d56a] to-[#c88b16] px-7 py-3 text-sm font-black text-[#4b0609]">CHECK PIN</button>
          </form>
          {pinResult && <p className={`mt-3 rounded-xl p-3 text-sm ${pinResult.serviceable ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300"}`}>{pinResult.message}</p>}
        </section>

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#e6b63b]">Customer favourites</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Hamari khaas peshkash</h2></div><div className="flex flex-wrap gap-2">{["All", "Traditional Sweets", "Barfi & Kaju", "Snacks & Chaat"].map((x) => <button key={x} onClick={() => setActive(x)} className={`rounded-full px-4 py-2 text-xs font-bold ${active === x ? "bg-[#f1bf3a] text-[#4b0609]" : "border border-[#6e191d] bg-[#250708] text-[#d7b9ba]"}`}>{x}</button>)}</div></div>
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{visible.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-[#8b3438] bg-[#35090b] p-7 sm:p-10">
          <div className="absolute inset-0"><BlurImage src="/vindhyavaisini/mithai-hero.png" alt="Indian sweets assortment" fill className="object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-r from-[#250406] via-[#250406]/95 to-transparent" /></div>
          <div className="relative max-w-xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#f1bf3a]">Celebrations made sweeter</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Har mauke ke liye premium mithai boxes</h2><p className="mt-4 text-sm leading-6 text-[#e1c8c9]">Pooja, shaadi, tyohar ya corporate gifting — apni pasand ki mithai aur packing ke saath custom order karein.</p><Link href="/products?category=Gift%20Boxes" className="mt-6 inline-flex rounded-full bg-[#f1bf3a] px-6 py-3 text-sm font-black text-[#4b0609]">Explore Gift Boxes →</Link></div>
        </section>
      </div>
    </div>
  );
}
