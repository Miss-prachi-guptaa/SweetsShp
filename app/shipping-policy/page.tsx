import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Chicksum Fresh Meats",
  description: "Delivery timelines, cold-chain packaging, and delivery zones for Chicksum in Varanasi, Uttar Pradesh.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="policy-page shell">
      <div className="policy-hero">
        <span className="eyebrow">COLD-CHAIN DISPATCH</span>
        <h1>Shipping &amp; Delivery Policy</h1>
        <p className="policy-subtitle">Express Doorstep Delivery Across Varanasi, Uttar Pradesh</p>
      </div>

      <div className="policy-card">
        <section>
          <h2>1. Service Area in Varanasi</h2>
          <p>We provide cold-box delivery across all primary zones in Varanasi within 45–60 minutes, including:</p>
          <div className="zones-pill-grid">
            <span>Khojwan</span>
            <span>Kashmiriganj</span>
            <span>Bhelupur</span>
            <span>Lanka / BHU</span>
            <span>Assi Ghat</span>
            <span>Durgakund</span>
            <span>Sigra</span>
            <span>Mahmoorganj</span>
            <span>Godowlia</span>
            <span>Varanasi Cantt</span>
            <span>Shivpur</span>
            <span>Pandeypur</span>
          </div>
        </section>

        <section>
          <h2>2. Delivery Timelines &amp; Slots</h2>
          <p>To ensure peak freshness right after slaughter, we operate three designated daily dispatch windows:</p>
          <ul>
            <li><strong>Morning Express (7:00 AM – 9:00 AM):</strong> Fresh morning cut, dispatched for early breakfast and lunch prep.</li>
            <li><strong>Lunch Fresh Cut (11:30 AM – 1:30 PM):</strong> Prepared right before noon for afternoon cooking.</li>
            <li><strong>Evening Dinner Cut (5:00 PM – 7:30 PM):</strong> Prepared for fresh evening meals and family dinners.</li>
          </ul>
        </section>

        <section>
          <h2>3. Cold-Chain &amp; Insulated Packaging</h2>
          <p>
            Every order is packed in food-grade vacuum pouches with reusable food-safe ice gel packs inside an insulated chiller box. This ensures temperatures remain strictly between <strong>0°C and 4°C</strong> from our cleanroom to your doorstep.
          </p>
        </section>

        <section>
          <h2>4. Free Delivery</h2>
          <p>
            Delivery is <strong>FREE on every order</strong>. No delivery charge is added at cart or checkout.
          </p>
        </section>

        <section>
          <h2>5. Customer Availability</h2>
          <p>
            Because fresh raw meat cannot be left unattended outdoors, our rider will call or message your WhatsApp number upon arrival. Please ensure someone is available at the address to receive the package and transfer it promptly to refrigeration.
          </p>
        </section>

        <div className="contact-callout">
          <p><strong>Dispatch Hub &amp; Enquiries:</strong></p>
          <p>📍 Store Address: Ghosi, Tehsil Ghosi, District Mau, Uttar Pradesh – 284128</p>
          <p>💬 WhatsApp Hotline: <a href="https://wa.me/919264933232">+91 92649 33232</a></p>
          <p>📞 Call Us: <a href="tel:+919264933232">+91 92649 33232</a></p>
          <p>✉️ Mail Id: <a href="mailto:Utkarsh.221005@gmail.com">Utkarsh.221005@gmail.com</a></p>
        </div>

        <div className="policy-back">
          <Link href="/" className="btn btn-gold">← Return to Fresh Cuts</Link>
        </div>
      </div>
    </div>
  );
}
