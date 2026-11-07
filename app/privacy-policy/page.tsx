import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Chicksum Fresh Meats",
  description: "Privacy Policy for Chicksum fresh meat WhatsApp enquiry and delivery services in Varanasi, Uttar Pradesh.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page shell">
      <div className="policy-hero">
        <span className="eyebrow">LEGAL &amp; COMPLIANCE</span>
        <h1>Privacy Policy</h1>
        <p className="policy-subtitle">Last Updated: October 2026 • Chicksum Fresh Meats, Varanasi</p>
      </div>

      <div className="policy-card">
        <section>
          <h2>1. Introduction</h2>
          <p>
            At Chicksum (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we value the trust you place in us when sharing your personal details for fresh meat enquiries and delivery dispatch in Varanasi, Uttar Pradesh. This Privacy Policy outlines how we collect, handle, and safeguard your information when you browse our website and communicate with us via WhatsApp, phone, or email.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We only collect information necessary to prepare and deliver your fresh meat cuts:</p>
          <ul>
            <li><strong>Contact Information:</strong> Your name, phone number, and WhatsApp contact details when you initiate an enquiry.</li>
            <li><strong>Delivery Details:</strong> Your address, landmark, and selected Varanasi delivery locality (e.g., Khojwan, Bhelupur, Lanka, Assi Ghat).</li>
            <li><strong>Order Preferences:</strong> Cut specifications (e.g., curry cut, biryani cut, skinless), portion weight, and preferred delivery time slots.</li>
            <li><strong>Technical Data:</strong> Basic browser cookies, IP address, and device type to optimize site loading and performance.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>Your details are used strictly for:</p>
          <ul>
            <li>Communicating order status, stock availability, and slaughter timings on WhatsApp.</li>
            <li>Dispatching your order to the designated delivery address via our cold-chain delivery team.</li>
            <li>Addressing customer support inquiries, custom cut requests, and feedback.</li>
            <li>Complying with applicable local food safety and commercial regulations.</li>
          </ul>
        </section>

        <section>
          <h2>4. WhatsApp Communications</h2>
          <p>
            Because we operate a direct-to-butcher WhatsApp enquiry model, conversations held on WhatsApp are subject to WhatsApp&apos;s end-to-end encryption and Meta&apos;s privacy policies. We do not sell, rent, or trade your WhatsApp chat history or contact numbers to third-party marketing companies.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate organizational and technical measures to protect your personal details from unauthorized access, loss, or disclosure. Our delivery personnel are granted access only to the necessary address details required to fulfill your delivery.
          </p>
        </section>

        <section>
          <h2>6. Contact Us Regarding Your Privacy</h2>
          <p>If you have any questions about our privacy practices, you may reach us directly:</p>
          <div className="contact-callout">
            <p><strong>Chicksum Fresh Meats</strong></p>
            <p>📍 Store Address: Ghosi, Tehsil Ghosi, District Mau, Uttar Pradesh – 284128</p>
            <p>📞 Phone / WhatsApp: <a href="https://wa.me/919919853648">+91 99198 53648</a></p>
            <p>✉️ Email: <a href="mailto:Utkarsh.221005@gmail.com">Utkarsh.221005@gmail.com</a></p>
          </div>
        </section>

        <div className="policy-back">
          <Link href="/" className="btn btn-gold">← Return to Fresh Cuts</Link>
        </div>
      </div>
    </div>
  );
}
