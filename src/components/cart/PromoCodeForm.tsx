"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { PromoCodeValidationResponse } from "@/types";

export default function PromoCodeForm() {
  const { appliedPromoCode, discount, applyPromoCode, removePromoCode } = useCart();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast({ title: "Enter a promo code", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data: PromoCodeValidationResponse = await res.json();
      if (data.valid && data.discount) {
        applyPromoCode(data.discount);
        toast({ title: "Promo code applied!", description: data.message });
      } else {
        toast({ title: "Invalid promo code", description: data.message, variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Could not validate promo code", variant: "destructive" });
    }
    setLoading(false);
    setCode("");
  };

  const handleRemove = () => {
    removePromoCode();
    toast({ title: "Promo code removed" });
  };

  return (
    <div className="mb-4">
      {discount ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-green-100 rounded px-3 py-2 text-green-800">
            <span>
              <b>{discount.code}</b> applied: {discount.description || ""}
            </span>
            <Button size="sm" variant="outline" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            value={code}
            onChange={e => setCode(e.target.value)}
            disabled={loading}
            className="flex-1"
            maxLength={20}
          />
          <Button onClick={handleApply} disabled={loading}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
