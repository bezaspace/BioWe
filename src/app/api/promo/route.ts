// Promo code validation API for cart page

import { NextRequest, NextResponse } from "next/server";
import { PromoCode, PromoCodeValidationResponse } from "@/types";

// Mock promo codes (in production, fetch from DB)
const PROMO_CODES: PromoCode[] = [
  {
    code: "BIO10",
    description: "10% off your order",
    discountType: "percentage",
    amount: 10,
    expiresAt: undefined,
    isActive: true,
  },
  {
    code: "BIO50",
    description: "₹50 off your order",
    discountType: "fixed",
    amount: 50,
    expiresAt: undefined,
    isActive: true,
  },
  {
    code: "EXPIRED",
    description: "Expired code",
    discountType: "percentage",
    amount: 20,
    expiresAt: "2024-01-01T00:00:00.000Z",
    isActive: true,
  },
];

function isExpired(expiresAt?: string) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json<PromoCodeValidationResponse>(
      { valid: false, message: "Promo code is required." },
      { status: 400 }
    );
  }

  const promo = PROMO_CODES.find(
    (p) => p.code.toLowerCase() === code.trim().toLowerCase()
  );

  if (!promo || !promo.isActive) {
    return NextResponse.json<PromoCodeValidationResponse>(
      { valid: false, message: "Invalid promo code." },
      { status: 404 }
    );
  }

  if (isExpired(promo.expiresAt)) {
    return NextResponse.json<PromoCodeValidationResponse>(
      { valid: false, message: "Promo code has expired." },
      { status: 410 }
    );
  }

  return NextResponse.json<PromoCodeValidationResponse>({
    valid: true,
    discount: {
      code: promo.code,
      amount: promo.amount,
      discountType: promo.discountType,
      description: promo.description,
    },
    message: "Promo code applied!",
  });
}
