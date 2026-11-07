"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SERVICEABLE_PINCODES } from "@/lib/delivery";

export { SERVICEABLE_PINCODES } from "@/lib/delivery";

export interface CartItem {
  id: number;
  itemKey?: string; // unique key combining product id and weight/variant
  name: string;
  slug: string;
  category: string;
  weight: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  cutType?: string;
}

export interface PincodeInfo {
  pincode: string;
  isServiceable: boolean;
  areaName?: string;
  deliveryTime?: string;
  deliveryFee: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number, selectedWeight?: string, selectedPrice?: number) => void;
  updateQuantity: (idOrKey: number | string, delta: number) => void;
  removeFromCart: (idOrKey: number | string) => void;
  clearCart: () => void;
  totalItems: number;
  itemsPrice: number;
  deliveryFee: number;
  couponCode: string;
  discount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  finalTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  pincodeInfo: PincodeInfo | null;
  verifyPincode: (pin: string) => { serviceable: boolean; message: string; areaName?: string };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo | null>(null);

  // Load from local storage safely
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("chiksum_cart");
      if (savedCart && savedCart !== "undefined" && savedCart !== "null") {
        setCart(JSON.parse(savedCart));
      }

      const savedPin = localStorage.getItem("chiksum_pincode");
      if (savedPin && savedPin !== "undefined" && savedPin !== "null") {
        const parsed = JSON.parse(savedPin);
        if (parsed && typeof parsed === "object" && SERVICEABLE_PINCODES[parsed.pincode]) {
          setPincodeInfo(parsed);
        } else {
          localStorage.removeItem("chiksum_pincode");
        }
      }
    } catch (e) {
      console.warn("Cleared corrupted local storage state:", e);
      localStorage.removeItem("chiksum_cart");
      localStorage.removeItem("chiksum_pincode");
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem("chiksum_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const verifyPincode = (pin: string) => {
    const cleanPin = pin.trim();
    if (!cleanPin || cleanPin.length !== 6) {
      return { serviceable: false, message: "Please enter a valid 6-digit PIN code." };
    }

    if (SERVICEABLE_PINCODES[cleanPin]) {
      const details = SERVICEABLE_PINCODES[cleanPin];
      const info: PincodeInfo = {
        pincode: cleanPin,
        isServiceable: true,
        areaName: details.area,
        deliveryTime: details.time,
        deliveryFee: details.fee,
      };
      setPincodeInfo(info);
      localStorage.setItem("chiksum_pincode", JSON.stringify(info));
      return { serviceable: true, message: `Serving ${details.area} (${details.time})`, areaName: details.area };
    } else {
      const info: PincodeInfo = {
        pincode: cleanPin,
        isServiceable: false,
        deliveryFee: 0,
      };
      setPincodeInfo(info);
      localStorage.setItem("chiksum_pincode", JSON.stringify(info));
      return {
        serviceable: false,
        message: "We do not currently deliver online to this PIN code.",
      };
    }
  };

  const addToCart = (product: any, quantity: number = 1, selectedWeight?: string, selectedPrice?: number) => {
    const finalWeight = selectedWeight || product.weight;
    const finalPrice = typeof selectedPrice === "number" ? selectedPrice : product.price;
    const key = `${product.id}_${finalWeight}`;

    setCart((prev) => {
      const existing = prev.find((item) => (item.itemKey || `${item.id}_${item.weight}`) === key);
      if (existing) {
        return prev.map((item) =>
          (item.itemKey || `${item.id}_${item.weight}`) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            itemKey: key,
            name: product.name,
            slug: product.slug || `${product.id}`,
            category: product.category,
            weight: finalWeight,
            price: finalPrice,
            originalPrice: product.originalPrice,
            image: product.image,
            quantity: quantity > 0 ? quantity : 1,
            cutType: product.cutType,
          },
        ];
      }
    });
  };

  const updateQuantity = (idOrKey: number | string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          const match =
            typeof idOrKey === "string"
              ? (item.itemKey || `${item.id}_${item.weight}`) === idOrKey || String(item.id) === idOrKey
              : item.id === idOrKey;
          if (match) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (idOrKey: number | string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (typeof idOrKey === "string") {
          return (item.itemKey || `${item.id}_${item.weight}`) !== idOrKey && String(item.id) !== idOrKey;
        }
        return item.id !== idOrKey;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode("");
    setDiscount(0);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemsPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery is free for every order.
  const deliveryFee = 0;

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "CHIK10" || clean === "WELCOME10") {
      const disc = Math.round(itemsPrice * 0.1);
      setDiscount(disc);
      setCouponCode(clean);
      return { success: true, message: "10% Flat Discount applied successfully!" };
    } else if (clean === "CHIK50" && itemsPrice >= 500) {
      setDiscount(50);
      setCouponCode(clean);
      return { success: true, message: "₹50 Instant Discount applied!" };
    } else {
      return { success: false, message: "Invalid coupon or minimum order value not met." };
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
  };

  const finalTotal = Math.max(0, itemsPrice + deliveryFee - discount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        itemsPrice,
        deliveryFee,
        couponCode,
        discount,
        applyCoupon,
        removeCoupon,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
        pincodeInfo,
        verifyPincode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
