import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import LocationGate from "@/components/LocationGate";
import StoreStatusBanner from "@/components/StoreStatusBanner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Vindhyavaisini — Mithai, Snacks & Gift Boxes in Ghosi, Mau",
  description: "Order fresh sweets, jalebi, samosa, chaat and gift boxes in Ghosi, District Mau. Free delivery within 2 km; minimum order ₹110.",
  icons: {
    icon: [
      { url: "/vindhyavaisini/logo.png" },
      { url: "/favicon.ico" }
    ],
    apple: "/vindhyavaisini/logo.png",
    shortcut: "/vindhyavaisini/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#120304] text-white antialiased min-h-screen pb-16 md:pb-0 font-sans selection:bg-[#F1BF3A] selection:text-[#4B0609]">
        <CartProvider>
          <StoreStatusBanner />
          <LocationGate />
          <Header />
          <main className="min-h-[calc(100vh-250px)]">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingContactButtons />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
