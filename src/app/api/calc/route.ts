// src/app/api/calc/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function computePricing(i: {
  productCost: number;
  warrantyYears: number;
  annualFailureRate: number;
  serviceCostPerClaim: number;
  targetMarginPct: number;
}) {
  const expectedClaimCost = round2(i.annualFailureRate * i.warrantyYears * i.serviceCostPerClaim);
  const denom = 1 - i.targetMarginPct;
  const suggestedPrice = round2(denom <= 0 ? expectedClaimCost : expectedClaimCost / denom);
  const contribution = suggestedPrice - expectedClaimCost;
  const breakEvenUnits = contribution > 0 ? round2(0 / contribution) : Infinity; // fixedCosts=0 for MVP
  return { expectedClaimCost, suggestedPrice, breakEvenUnits };
}

const Schema = z.object({
  productCost: z.number().nonnegative(),
  warrantyYears: z.number().int().positive(),
  annualFailureRate: z.number().min(0),
  serviceCostPerClaim: z.number().min(0),
  targetMarginPct: z.number().min(0).max(0.95),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.parse(body);
    const result = computePricing(parsed);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Invalid input' }, { status: 400 });
  }
}
