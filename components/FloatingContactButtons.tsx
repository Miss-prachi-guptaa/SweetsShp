"use client";

import React from "react";
import { WhatsAppIcon } from "./Icons";
import { useCart } from "@/lib/CartContext";

const WHATSAPP_NUMBER = "919264933232";
const WHATSAPP_DEFAULT_TEXT = "Namaste Vindhyavaisini! I want to order fresh mithai and snacks in Ghosi. Please share today's menu.";

export default function FloatingContactButtons() {
  const { isCartOpen, totalItems } = useCart();

  if (isCartOpen) return null;

  return (
    <div
      className={`floating-contact-container ${totalItems > 0 ? "has-active-cart-pill" : ""}`}
      aria-label="Quick Contact Actions"
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_TEXT)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn floating-wa-btn"
        aria-label="Chat on WhatsApp"
        title="WhatsApp assistance"
      >
        <div className="floating-circle wa-circle">
          <WhatsAppIcon size={30} color="#FFFFFF" />
        </div>
        <span className="floating-label" role="tooltip">WhatsApp Assistance</span>
      </a>
    </div>
  );
}
