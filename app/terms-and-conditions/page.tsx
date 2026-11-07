import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Chicksum Fresh Meats",
  description: "Terms and Conditions governing the use of Chicksum fresh meat WhatsApp enquiry and supply service in Varanasi, Uttar Pradesh.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="policy-page shell">
      <div className="policy-hero">
        <span className="eyebrow">TERMS OF USE</span>
        <h1>Terms &amp; Conditions</h1>
        <p className="policy-subtitle">Effective Date: October 2026 • Chicksum, Varanasi</p>
      </div>

      <div className="policy-card">
        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing our website and engaging with our butcher team through WhatsApp, telephone, or in-person delivery, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2>2. WhatsApp Enquiry &amp; Order Placement</h2>
          <p>
            Chicksum operates primarily as an assisted WhatsApp order service. Prices, daily weight batches, and seasonal catches (e.g., river tengra fish, payasi fillets, king prawns) displayed on the website represent current prevailing rates and are subject to real-time daily market availability confirmed on WhatsApp.
          </p>
        </section>

        <section>
          <h2>3. Net Consumable Weight Standard</h2>
          <p>
            Unlike open butcher stalls where gross weight includes wastage (feathers, head, blood, viscera), Chicksum products are weighed after professional dressing and cleaning. Minor variance (within &plusmn;5%) may occur due to natural cut trimming.
          </p>
        </section>

        <section>
          <h2>4. Pricing &amp; Payment Terms</h2>
          <p>
            All listed prices are in Indian Rupees (INR). Payments may be made via Cash on Delivery (COD) or UPI transfer directly to the delivery partner upon handover. We reserve the right to revise catalog prices based on daily livestock market conditions.
          </p>
        </section>

        <section>
          <h2>5. Safe Food Handling &amp; Storage Advice</h2>
          <p>
            Because our meats contain no chemical preservatives, customers are strongly advised to store fresh cuts in a refrigerator at 0°C to 4°C immediately upon receipt, or cook within 24 to 48 hours for optimal flavor and texture.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            Chicksum shall not be liable for any indirect or consequential damages resulting from improper cooking, delayed receipt by the customer, or storage contrary to recommended guidelines.
          </p>
        </section>

        <section>
          <h2>7. Governing Jurisdiction</h2>
          <p>
            These terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the competent courts in Varanasi, Uttar Pradesh.
          </p>
        </section>

        <div className="contact-callout">
          <p><strong>Chicksum Fresh Meats</strong></p>
          <p>📍 Store Address: Ghosi, Tehsil Ghosi, District Mau, Uttar Pradesh – 284128</p>
          <p>📞 Call Us: <a href="tel:+919264933232">+91 92649 33232</a></p>
          <p>💬 WhatsApp: <a href="https://wa.me/919264933232">+91 92649 33232</a></p>
          <p>✉️ Mail Id: <a href="mailto:Utkarsh.221005@gmail.com">Utkarsh.221005@gmail.com</a></p>
        </div>

        <div className="policy-back">
          <Link href="/" className="btn btn-gold">← Return to Fresh Cuts</Link>
        </div>
      </div>
    </div>
  );
}
