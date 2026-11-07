"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import ProductCard from "@/components/ProductCard";

const categoryTabs = ["All", "Traditional Sweets", "Barfi & Kaju", "Laddoo & Dry Sweets", "Bengali Sweets", "Snacks & Chaat", "Gift Boxes", "Namkeen", "Beverages"];

function ProductsContent() {
  const params = useSearchParams();
  const category = params.get("category") || "All";
  const initialSearch = params.get("search") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [subcut, setSubcut] = useState("All");

  useEffect(() => { fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || d.data || [])).catch(() => setProducts([])); }, []);
  useEffect(() => setSubcut("All"), [category]);

  const inCategory = useMemo(() => category === "All" ? products : products.filter((p) => p.category === category), [products, category]);
  const subcuts = useMemo(() => Array.from(new Set(inCategory.map((p) => p.subcut).filter(Boolean))) as string[], [inCategory]);
  const filtered = inCategory.filter((p) => {
    if (subcut !== "All" && p.subcut !== subcut) return false;
    const q = search.trim().toLowerCase();
    return !q || `${p.name} ${p.category} ${p.subcut} ${p.description}`.toLowerCase().includes(q);
  });

  const heading = category === "All" ? "Har swaad, ek hi jagah" : category;
  return (
    <div className="min-h-screen bg-[#120304] px-4 py-6 text-white sm:px-6 lg:px-10 xl:px-12">
      <section className="relative min-h-[250px] overflow-hidden rounded-3xl border border-[#7f292e] shadow-2xl sm:min-h-[310px]">
        <BlurImage src="/vindhyavaisini/mithai-hero.png" alt="Vindhyavaisini Indian sweets" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#190304] via-[#290507]/90 to-transparent" />
        <div className="relative z-10 flex min-h-[250px] max-w-2xl flex-col justify-center p-7 sm:min-h-[310px] sm:p-12">
          <span className="w-fit rounded-full border border-[#f1bf3a]/40 bg-black/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#f7d56a]">Freshly prepared • Traditional recipes</span>
          <h1 className="mt-5 text-3xl font-black uppercase leading-tight sm:text-5xl">{heading}<br /><span className="text-[#f1bf3a]">Vindhyavaisini ke saath</span></h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#ecd7d8]">Fresh mithai, hot snacks, festive gift boxes aur chilled beverages — everyday celebrations ke liye.</p>
        </div>
      </section>

      <nav className="mt-7 flex gap-3 overflow-x-auto pb-3" aria-label="Sweet shop categories">
        {categoryTabs.map((tab) => <Link key={tab} href={tab === "All" ? "/products" : `/products?category=${encodeURIComponent(tab)}`} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${category === tab ? "border-[#f1bf3a] bg-[#f1bf3a] text-[#4b0609]" : "border-[#6e191d] bg-[#250708] text-[#d9bfc0] hover:border-[#f1bf3a]"}`}>{tab}</Link>)}
      </nav>

      {subcuts.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{["All", ...subcuts].map((s) => <button key={s} onClick={() => setSubcut(s)} className={`rounded-lg px-3 py-2 text-xs ${subcut === s ? "bg-[#8c1c22] text-white" : "bg-[#250708] text-[#c9a7a8]"}`}>{s}</button>)}</div>}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[#c9a7a8]"><b className="text-white">{filtered.length}</b> delicious choices</p><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search mithai or snacks..." className="w-full rounded-xl border border-[#6e191d] bg-[#250708] px-4 py-2.5 text-sm outline-none focus:border-[#f1bf3a] sm:max-w-xs" /></div>

      {filtered.length ? <div className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <div className="mt-6 rounded-2xl border border-[#6e191d] bg-[#250708] p-14 text-center text-[#c9a7a8]">No items found. Try another category or search.</div>}
    </div>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#120304] p-10 text-center text-white">Loading mithai…</div>}><ProductsContent /></Suspense>;
}
