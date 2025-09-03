'use client';
import { useState } from 'react';

type Result = {
  expectedClaimCost: number;
  suggestedPrice: number;
  breakEvenUnits: number;
};

export default function CalcPage() {
  const [productName, setProductName] = useState('');
  const [currency, setCurrency] = useState('AUD');
  const [productCost, setProductCost] = useState(500);
  const [warrantyYears, setWarrantyYears] = useState(2);
  const [annualFailureRate, setAnnualFailureRate] = useState(0.05);
  const [serviceCostPerClaim, setServiceCostPerClaim] = useState(120);
  const [targetMarginPct, setTargetMarginPct] = useState(0.3);

  const [result, setResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function calculate() {
    setError(null);
    try {
      const res = await fetch('/api/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCost: Number(productCost),
          warrantyYears: Number(warrantyYears),
          annualFailureRate: Number(annualFailureRate),
          serviceCostPerClaim: Number(serviceCostPerClaim),
          targetMarginPct: Number(targetMarginPct),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function saveModel() {
    if (!result) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          currency,
          productCost: Number(productCost),
          warrantyYears: Number(warrantyYears),
          annualFailureRate: Number(annualFailureRate),
          serviceCostPerClaim: Number(serviceCostPerClaim),
          targetMarginPct: Number(targetMarginPct),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      alert('Saved!');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <h1 className="text-3xl font-semibold">Warranty Pricing Calculator</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="space-y-6 p-6 border rounded-2xl">
          <div>
            <label className="block text-sm mb-1">Product Name</label>
            <input value={productName} onChange={(e)=>setProductName(e.target.value)} className="w-full border rounded-lg p-2" placeholder="e.g., Ultrasound Probe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Currency</label>
              <input value={currency} onChange={(e)=>setCurrency(e.target.value)} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Product Cost</label>
              <input type="number" step="0.01" value={productCost} onChange={(e)=>setProductCost(Number(e.target.value))} className="w-full border rounded-lg p-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Warranty Years</label>
              <input type="number" value={warrantyYears} onChange={(e)=>setWarrantyYears(Number(e.target.value))} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Annual Failure Rate (0.05 = 5%)</label>
              <input type="number" step="0.0001" value={annualFailureRate} onChange={(e)=>setAnnualFailureRate(Number(e.target.value))} className="w-full border rounded-lg p-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Service Cost per Claim</label>
              <input type="number" step="0.01" value={serviceCostPerClaim} onChange={(e)=>setServiceCostPerClaim(Number(e.target.value))} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Target Margin (0.30 = 30%)</label>
              <input type="number" step="0.01" value={targetMarginPct} onChange={(e)=>setTargetMarginPct(Number(e.target.value))} className="w-full border rounded-lg p-2" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={calculate} className="px-4 py-2 border rounded-xl">Calculate</button>
            <button onClick={saveModel} disabled={!result || saving} className="px-4 py-2 border rounded-xl disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Model'}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Results */}
        <div className="p-6 border rounded-2xl">
          <h2 className="font-semibold mb-4">Results</h2>
          {!result ? (
            <p className="text-gray-600">Run a calculation to see suggested pricing and cost breakdown.</p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between"><span>Expected Claim Cost:</span><span>{currency} {result.expectedClaimCost.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-semibold"><span>Suggested Warranty Price:</span><span>{currency} {result.suggestedPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Break-even Units:</span><span>{Number.isFinite(result.breakEvenUnits) ? result.breakEvenUnits.toFixed(2) : 'N/A'}</span></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}