import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#100203] border-t border-[#6E191D] text-neutral-400 text-xs mt-12 pb-20 md:pb-8">
      {/* Main Footer Container matching reference wireframe */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group inline-flex">
              <div className="relative h-16 w-48 shrink-0 flex items-center justify-center">
                <Image
                  src="/vindhyavaisini/logo.png"
                  alt="Vindhyavaisini Sweets"
                  width={240}
                  height={90}
                  className="h-auto w-full object-contain drop-shadow-[0_2px_8px_rgba(218,174,60,0.4)] group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="sr-only">
                <span className="text-xl font-black tracking-wider bg-gradient-to-r from-[#FBF0A6] via-[#DAAE3C] to-[#9E7422] bg-clip-text text-transparent block leading-none">
                  VINDHYAVAISINI
                </span>
                <span className="text-[10px] text-neutral-400 font-medium tracking-tight">
                  Mithai, Snacks &amp; Gift Boxes
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Fresh Indian mithai, hot snacks, namkeen, beverages and celebration gift boxes — made with tradition in Ghosi, District Mau.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919919853648"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#121721] hover:bg-[#25D366] text-neutral-300 hover:text-black flex items-center justify-center transition-all border border-[#212838]"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#DAAE3C] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#DAAE3C] transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=Traditional%20Sweets" className="hover:text-[#DAAE3C] transition-colors">Traditional Sweets</Link>
              </li>
              <li>
                <Link href="/products?category=Barfi%20%26%20Kaju" className="hover:text-[#DAAE3C] transition-colors">Barfi &amp; Kaju</Link>
              </li>
              <li>
                <Link href="/products?category=Snacks%20%26%20Chaat" className="hover:text-[#DAAE3C] transition-colors">Snacks &amp; Chaat</Link>
              </li>
              <li>
                <Link href="/products?category=Gift%20Boxes" className="hover:text-[#DAAE3C] transition-colors">Gift Boxes</Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-[#DAAE3C] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DAAE3C] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wider">Customer Support</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/delivery-areas" className="hover:text-[#DAAE3C] transition-colors">Delivery Areas</Link>
              </li>
              <li>
                <Link href="/my-orders" className="hover:text-[#DAAE3C] transition-colors">My Orders</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DAAE3C] transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#DAAE3C] transition-colors">Return &amp; Refund</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#DAAE3C] transition-colors">Policies</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DAAE3C] transition-colors">Help</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect With Us */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wider">Connect With Us</h3>
            <a
              href="https://wa.me/919919853648?text=Namaste%20Vindhyavaisini!%20I%20need%20help%20with%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#121721] hover:bg-[#25D366] text-white hover:text-black border border-[#212838] hover:border-[#25D366] px-4 py-2.5 rounded-full transition-all text-xs font-semibold shadow-md group"
            >
              <span className="w-6 h-6 rounded-full bg-[#25D366] text-black group-hover:bg-black group-hover:text-[#25D366] flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </span>
              <span>Chat on WhatsApp</span>
            </a>
            <p className="text-[11px] text-neutral-400">
              Helpline: +91 99198 53648<br />
              Email: <a href="mailto:Utkarsh.221005@gmail.com" className="hover:text-[#DAAE3C] text-neutral-300">Utkarsh.221005@gmail.com</a><br />
              Ghosi, Tehsil Ghosi, District Mau – 284128<br />Free delivery within 2 km • Minimum order ₹110
            </p>
          </div>

        </div>

        {/* Bottom Bar with Copyright */}
        <div className="mt-12 pt-6 border-t border-[#1C222E] flex items-center justify-center text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Vindhyavaisini. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

