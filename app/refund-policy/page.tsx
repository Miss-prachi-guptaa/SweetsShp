import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Chicksum Fresh Meats",
  description: "Refund, replacement and cancellation policy for Chicksum fresh meat products in Varanasi, Uttar Pradesh.",
};

export default function RefundPolicyPage() {
  return (
    <div className="policy-page shell">
      <div className="policy-hero">
        <span className="eyebrow">CUSTOMER ASSURANCE</span>
        <h1>Refund &amp; Cancellation Policy</h1>
        <p className="policy-subtitle">100% Freshness Guarantee • Chicksum Fresh Meats, Varanasi</p>
      </div>

      <div className="policy-card">
        <section>
          <h2>1. Freshness &amp; Quality Commitment</h2>
          <p>
            At Chicksum, our meat is <strong>100% fresh, ethically prepared, and never frozen</strong>. Because raw poultry, mutton, and seafood are highly perishable goods cut specifically to order, we uphold stringent quality control prior to dispatch.
          </p>
        </section>

        <section>
          <h2>2. Order Cancellation</h2>
          <p>
            You may cancel or amend your order at any time <strong>before our master butcher begins cutting your portion</strong>. Since custom cuts cannot be re-purposed, once the order has been prepared and vacuum-packed, cancellations cannot be accepted.
          </p>
          <p>
            To cancel an order before preparation begins, please message us immediately on WhatsApp at <a href="https://wa.me/919264933232"><strong>+91 92649 33232</strong></a>.
          </p>
        </section>

        <section>
          <h2>3. Eligibility for Replacement or Refund</h2>
          <p>We provide immediate replacements or full refunds under the following circumstances:</p>
          <ul>
            <li><strong>Quality / Freshness Issue:</strong> If the meat package does not meet our guaranteed cold-chain standard upon delivery.</li>
            <li><strong>Incorrect Cut or Weight:</strong> If you received an incorrect cut or portion different from what was confirmed on WhatsApp.</li>
            <li><strong>Damaged Packaging:</strong> If the insulated vacuum seal is compromised during transit.</li>
          </ul>
        </section>

        <section>
          <h2>4. Inspection on Delivery</h2>
          <p>
            We encourage customers to inspect the outer seal and package temperature upon delivery. In the rare event of a quality concern, please notify our delivery executive or send a photo to our WhatsApp hotline within <strong>2 hours of delivery</strong>.
          </p>
        </section>

        <section>
          <h2>5. Refund Processing</h2>
          <p>
            Approved refunds for online or UPI payments will be initiated back to your original source account or UPI ID within <strong>24 to 48 hours</strong>. For Cash on Delivery orders, refunds are issued via direct UPI transfer or credited towards your next order.
          </p>
        </section>

        <div className="contact-callout">
          <p><strong>Need Assistance with an Order?</strong></p>
          <p>💬 WhatsApp Support: <a href="https://wa.me/919264933232">+91 92649 33232</a></p>
          <p>📞 Call Us: <a href="tel:+919264933232">+91 92649 33232</a></p>
          <p>✉️ Mail Id: <a href="mailto:Utkarsh.221005@gmail.com">Utkarsh.221005@gmail.com</a></p>
          <p>📍 Store Address: Ghosi, Tehsil Ghosi, District Mau, Uttar Pradesh – 284128</p>
          <p>🕒 Support Hours: 7:00 AM – 9:00 PM (Every Day)</p>
        </div>

        <div className="policy-back">
          <Link href="/" className="btn btn-gold">← Return to Fresh Cuts</Link>
        </div>
      </div>
    </div>
  );
}
