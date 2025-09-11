import Link from 'next/link';
import Navbar from '../components/Navbar';

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AllocationCard() {
  return (
    <div className="animate-float rounded-2xl bg-white/90 backdrop-blur shadow-xl ring-1 ring-black/5 p-5 w-[280px] sm:w-[320px]">
      <div className="text-sm text-gray-500 mb-2">Portfolio Allocation</div>
      <div className="text-base font-semibold text-gray-800 mb-4">Optimised Distribution</div>
      <div className="space-y-3">
        <StatBar label="Equity" value={45} color="bg-emerald-500" />
        <StatBar label="Debt" value={30} color="bg-blue-500" />
        <StatBar label="Gold" value={15} color="bg-amber-500" />
        <StatBar label="International" value={10} color="bg-fuchsia-500" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">Expected Return</span>
        <span className="text-sm font-semibold text-emerald-600">11.2% p.a.</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-indigo-50">
      {/* Navigation Bar */}
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-40 w-40 sm:h-56 sm:w-56 lg:h-72 lg:w-72 bg-gradient-to-br from-emerald-400/20 to-indigo-400/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="animate-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium ring-1 ring-emerald-600/20 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-600"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Advanced Portfolio Theory
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Plan Smarter. <span className="text-emerald-600">Allocate Better.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Use data-backed simulations to plan your portfolio with confidence. Advanced analytics meet intuitive design for smarter investment decisions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/optimizer" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="#features" className="inline-flex items-center gap-2 rounded-lg bg-white text-gray-900 font-semibold px-5 py-3 ring-1 ring-gray-200 hover:bg-gray-50">
                  Learn More
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="inline-flex items-center gap-2"><CheckIcon /> Modern Portfolio Theory</div>
                <div className="inline-flex items-center gap-2"><CheckIcon /> 30+ instruments</div>
                <div className="inline-flex items-center gap-2"><CheckIcon /> Real-time rebalancing</div>
                <div className="inline-flex items-center gap-2"><CheckIcon /> Performance tracking</div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end overflow-visible">
              <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="inline-block transform origin-top scale-50 sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.9] xl:scale-[1.3] lg:origin-top-right">
                <AllocationCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">Why Choose Fund Crafts?</h2>
          <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
            Our platform combines advanced portfolio theory with intuitive design to deliver institutional-grade investment optimization.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon="analytics" title="Smart Analytics" description="Advanced optimization using modern portfolio theory and ML-inspired heuristics." />
            <FeatureCard icon="shield" title="Risk Management" description="Comprehensive risk analysis and scenario modeling to protect your investments." />
            <FeatureCard icon="growth" title="Growth Simulation" description="Simulations for future projections with confidence intervals." />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-500 p-6 sm:p-8 lg:p-10 text-white text-center shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to Optimize Your Portfolio?</h3>
            <p className="mt-2 text-white/90 max-w-2xl mx-auto">thousands of smart investors using data-driven allocation strategies. Start building your optimized portfolio in minutes.</p>
            <div className="mt-6">
              <Link href="/optimizer" className="inline-flex items-center gap-2 rounded-lg bg-white text-emerald-700 font-semibold px-6 py-3 hover:bg-gray-100">
                Start Building Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: 'analytics' | 'shield' | 'growth'; title: string; description: string }) {
  return (
    <div className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-indigo-100 text-emerald-700">
        {icon === 'analytics' ? <AnalyticsIcon /> : icon === 'shield' ? <ShieldIcon /> : <GrowthIcon />}
      </div>
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{description}</div>
    </div>
  );
}


function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 14l3-3 4 4 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
      <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
      <path d="M3 17h18M7 17V9m5 8V6m5 11v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
