// src/app/page.tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">Warranty Pricing, Simplified</h1>
        <p className="text-lg md:text-xl text-gray-600">
          Calculate margin-smart warranty prices in minutes. No spreadsheets. No guesswork.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <a href="/calc" className="rounded-2xl px-6 py-3 border hover:shadow">Try the Calculator</a>
          <a href="#" className="rounded-2xl px-6 py-3 border">View Saved Models</a>
        </div>
      </section>
    </main>
  );
}