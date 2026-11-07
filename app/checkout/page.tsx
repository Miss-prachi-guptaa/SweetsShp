"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { isServiceablePincode } from "@/lib/delivery";
import { checkCartMinWeightViolations } from "@/lib/weightHelper";
import { MINIMUM_ORDER_VALUE } from "@/lib/shop";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, itemsPrice, deliveryFee, discount, couponCode, finalTotal, clearCart, pincodeInfo, verifyPincode } = useCart();

  // Form states
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState(pincodeInfo?.pincode || "");
  const [deliverySlot, setDeliverySlot] = useState("Express (45-60 mins)");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI_ON_DELIVERY">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isStoreClosed, setIsStoreClosed] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.settings && d.settings.isStoreOpen === false) {
          setIsStoreClosed(true);
        }
      })
      .catch(() => {});
  }, []);

  const minWeightViolations = checkCartMinWeightViolations(cart);
  const hasWeightViolation = minWeightViolations.length > 0;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0D12] text-white flex items-center justify-center p-4">
        <div className="bg-[#12161F] border border-[#232938] rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#181D27] flex items-center justify-center mx-auto text-neutral-400">
            🛒
          </div>
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="text-xs text-neutral-400">Add some mithai or snacks before proceeding to checkout.</p>
          <Link
            href="/products"
            className="inline-block bg-[#DAAE3C] text-black font-bold text-xs uppercase px-6 py-3 rounded-xl tracking-wide"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // All orders are eligible for Pay on Delivery (Cash or UPI Scan)
  const isCodEligible = true;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isStoreClosed) {
      setErrorMessage("Store is currently closed for daily sanitization. Orders are paused right now.");
      return;
    }

    if (hasWeightViolation) {
      setErrorMessage(`Please adjust your cart to meet minimum order weight requirement: ${minWeightViolations.map((v) => `${v.name} (min ${v.minDisplay})`).join(", ")}`);
      return;
    }

    if (itemsPrice < MINIMUM_ORDER_VALUE) {
      setErrorMessage(`Minimum order value is ₹${MINIMUM_ORDER_VALUE}. Please add ₹${MINIMUM_ORDER_VALUE - itemsPrice} more to continue.`);
      return;
    }

    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!streetAddress.trim()) {
      setErrorMessage("Please enter your complete delivery address.");
      return;
    }

    if (!pincode || pincode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit delivery PIN code.");
      return;
    }

    if (!isServiceablePincode(pincode)) {
      verifyPincode(pincode);
      setErrorMessage("Sorry, delivery is available only within 2 km of our Ghosi shop (PIN 284128)." );
      return;
    }

    verifyPincode(pincode);

    setIsSubmitting(true);

    const orderId = `CHK-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      orderId,
      customerName: customerName || "Customer",
      mobileNumber,
      streetAddress,
      landmark,
      pincode,
      deliverySlot,
      paymentMethod,
      items: cart,
      itemsPrice,
      deliveryFee,
      discount,
      couponCode,
      finalTotal,
      date: new Date().toISOString(),
      status: "CONFIRMED",
    };

    try {
      // 1. Post to Backend API (Saves to Admin Store & Prepares WhatsApp/Email Notifications)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "This order cannot be delivered to the selected PIN code.");
      }

      // 2. Save locally for customer's My Orders page
      const existingOrders = JSON.parse(localStorage.getItem("chiksum_orders") || "[]");
      existingOrders.unshift(orderData);
      localStorage.setItem("chiksum_orders", JSON.stringify(existingOrders));

      clearCart();
      
      // Auto open WhatsApp notification for admin so store receives immediate details
      if (data.whatsappAdminUrl) {
        try {
          window.open(data.whatsappAdminUrl, "_blank");
        } catch (e) {
          console.warn("Could not auto-open WhatsApp:", e);
        }
      }

      router.push(`/order-success/${orderId}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      setErrorMessage(err instanceof Error ? err.message : "Unable to place this order. Please verify your delivery PIN code.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      <div className="mb-6">
        <Link href="/" className="text-xs text-neutral-400 hover:text-[#DAAE3C] flex items-center gap-1">
          ← Back to shopping
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
          Checkout &amp; Delivery
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Fast checkout without mandatory account signup. Clear charges before payment.
        </p>
      </div>

      {paymentFailed && (
        <div className="bg-red-950/60 border border-red-700/80 rounded-2xl p-4 mb-6 text-sm text-red-200 space-y-2 animate-fade-in">
          <div className="font-bold flex items-center gap-2 text-red-400">
            ⚠️ Online Payment Was Not Completed
          </div>
          <p className="text-xs">
            Your cart is completely safe and no money was deducted. You can retry with UPI / Cards or switch instantly to <strong>Cash on Delivery (COD)</strong>.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setPaymentFailed(false);
                setPaymentMethod("COD");
              }}
              className="bg-white text-black font-bold text-xs px-4 py-2 rounded-lg"
            >
              Switch to Cash on Delivery (COD)
            </button>
            <button
              onClick={() => setPaymentFailed(false)}
              className="bg-red-900/60 border border-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg"
            >
              Retry Online Payment
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contact & Address */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Customer Details */}
          <div className="bg-[#12161F] border border-[#232938] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E2533] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#DAAE3C] text-black font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-bold text-base text-white">Contact &amp; Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#0A0D12] border border-[#2B3447] focus:border-[#DAAE3C] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Mobile Number (for delivery OTP &amp; updates) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-[#0A0D12] border border-[#2B3447] focus:border-[#DAAE3C] rounded-xl pl-11 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Complete Delivery Address (House / Flat / Street) *
              </label>
              <textarea
                rows={2}
                placeholder="House No., Apartment name, Street / Ward, Locality"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full bg-[#0A0D12] border border-[#2B3447] focus:border-[#DAAE3C] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Near temple, school, or main road"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-[#0A0D12] border border-[#2B3447] focus:border-[#DAAE3C] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Delivery PIN Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[#0A0D12] border border-[#2B3447] focus:border-[#DAAE3C] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Slot Selection */}
          <div className="bg-[#12161F] border border-[#232938] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E2533] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#DAAE3C] text-black font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-bold text-base text-white">Select Delivery Slot</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Express (45-60 mins)", desc: "Fresh cut dispatched immediately", badge: "Fastest" },
                { title: "Morning (7 AM - 10 AM)", desc: "Fresh dawn cut for lunch prep" },
                { title: "Evening (4 PM - 7 PM)", desc: "Prime evening curry cut" },
              ].map((slot) => (
                <label
                  key={slot.title}
                  className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between ${
                    deliverySlot === slot.title
                      ? "border-[#DAAE3C] bg-[#DAAE3C]/10"
                      : "border-[#232938] bg-[#0A0D12] hover:border-[#384358]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{slot.title}</span>
                      <input
                        type="radio"
                        name="deliverySlot"
                        value={slot.title}
                        checked={deliverySlot === slot.title}
                        onChange={(e) => setDeliverySlot(e.target.value)}
                        className="accent-[#DAAE3C]"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">{slot.desc}</p>
                  </div>
                  {slot.badge && (
                    <span className="mt-2 text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                      ★ {slot.badge}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Choose Payment Method */}
          <div className="bg-[#12161F] border border-[#232938] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E2533] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#DAAE3C] text-black font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="font-bold text-base text-white">Choose Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-[#DAAE3C] bg-[#DAAE3C]/10"
                    : "border-[#232938] bg-[#0A0D12] hover:border-[#384358]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">💵</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-neutral-400">Pay in cash when order arrives</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-[#DAAE3C] w-4 h-4 cursor-pointer"
                  />
                </div>
              </label>

              {/* Option 2: UPI on Delivery (Scan QR) */}
              <label
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === "UPI_ON_DELIVERY"
                    ? "border-[#DAAE3C] bg-[#DAAE3C]/10"
                    : "border-[#232938] bg-[#0A0D12] hover:border-[#384358]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📱</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">UPI on Delivery (Scan QR)</h4>
                      <p className="text-[11px] text-neutral-400">GPay, PhonePe, Paytm on arrival</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI_ON_DELIVERY"
                    checked={paymentMethod === "UPI_ON_DELIVERY"}
                    onChange={() => setPaymentMethod("UPI_ON_DELIVERY")}
                    className="accent-[#DAAE3C] w-4 h-4 cursor-pointer"
                  />
                </div>
              </label>
            </div>

            {/* Helper reassurance banner */}
            <div className="bg-[#181D27] border border-[#232938] p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-neutral-300">
              <span className="text-base text-[#DAAE3C]">✨</span>
              <span>
                Zero advance payment needed. Check your fresh order upon arrival and pay comfortably via <strong>Cash</strong> or <strong>UPI QR Scanner</strong>.
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Button */}
        <div className="space-y-4">
          <div className="bg-[#12161F] border border-[#232938] rounded-2xl p-5 space-y-4 sticky top-24">
            <h3 className="font-bold text-sm text-white border-b border-[#1E2533] pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Cart mini items */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="truncate max-w-[170px]">
                    <span className="font-semibold text-white block truncate">{item.name}</span>
                    <span className="text-[10px] text-neutral-400">{item.weight} x {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-white">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="border-t border-[#1E2533] pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Items Subtotal</span>
                <span className="text-white font-mono">₹{itemsPrice}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon ({couponCode})</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}
              <div className="border-t border-[#1E2533] pt-2 flex justify-between text-base font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-[#DAAE3C] font-mono">₹{finalTotal}</span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400 font-medium bg-red-950/40 p-2 rounded-lg border border-red-800">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#DAAE3C] hover:bg-[#B58729] text-black font-black py-3.5 px-4 rounded-xl transition-all shadow-[0_4px_16px_rgba(218,174,60,0.3)] text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>PLACE ORDER (₹{finalTotal})</span>
                  <span>→</span>
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-neutral-500">
              🔒 Safe &amp; Secure Checkout. 100% Satisfaction Guarantee.
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}

