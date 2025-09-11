import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export const metadata: Metadata = {
  title: 'About • Fund Craft',
  description: 'Learn about Fund Craft — our mission, values, and the team behind the portfolio optimizer.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-indigo-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-60 w-60 sm:h-72 sm:w-72 lg:h-96 lg:w-96 bg-gradient-to-br from-emerald-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-60 w-60 sm:h-72 sm:w-72 lg:h-96 lg:w-96 bg-gradient-to-tr from-indigo-400/20 to-emerald-400/20 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="stagger">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium ring-1 ring-emerald-600/20">
                  <SparkleIcon />
                  About Fund Craft
                </span>
                <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                  Investing clarity, engineered with care.
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-xl">
                  We build intuitive, data-driven tools that help you plan, test, and optimize portfolios with confidence — combining academic rigor with delightful UX.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/optimizer" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                    Try the Optimizer
                    <ArrowIcon />
                  </Link>
                  <Link href="/#features" className="inline-flex items-center gap-2 rounded-lg bg-white text-gray-900 font-semibold px-5 py-3 ring-1 ring-gray-200 hover:bg-gray-50">
                    Explore Features
                  </Link>
                </div>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard label="Backtested Scenarios" value="10k+" />
                  <StatCard label="Avg. Speed-up" value="4.3x" />
                  <StatCard label="Global Instruments" value="30+" />
                  <StatCard label="Uptime" value="99.9%" />
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <div className="animate-float inline-flex flex-col gap-4 p-4">
                  <HeroCard title="Risk/Return Frontier" subtitle="Efficient frontier sampled" tone="emerald" />
                  <HeroCard title="Rebalance" subtitle="Threshold-based" tone="indigo" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our mission</h2>
                <p className="mt-3 text-gray-600">
                  Democratize advanced portfolio design through approachable, high-performance software. We believe powerful analytics should feel effortless and human.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">What we value</h2>
            <p className="mt-2 text-center text-gray-600 max-w-2xl mx-auto">
              Grounded in research, elevated by design, and measured by user outcomes.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              <ValueCard icon="research" title="Research Rigor" description="We align with modern portfolio theory and continuously validate with real-world data." />
              <ValueCard icon="craft" title="Craft & UX" description="Every detail matters — from motion curves to focus states and empty screens." />
              <ValueCard icon="trust" title="Trust & Safety" description="Your data stays your data. We favor local computation and transparent algorithms." />
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Journey so far</h2>
            <ol className="mt-8 relative border-s border-gray-200">
              <TimelineItem title="Idea & early prototypes" description="Started with a simple optimizer and a goal: make portfolio theory accessible." />
              <TimelineItem title="Public preview" description="Launched an interactive demo, gathered feedback from early adopters." />
              <TimelineItem title="Portfolio Optimizer" description="Shipped an end-to-end flow with analytics, constraints, and simulations." last />
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-500 p-6 sm:p-8 lg:p-10 text-white text-center shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold">Build smarter portfolios today</h3>
              <p className="mt-2 text-white/90 max-w-2xl mx-auto">
                Join investors exploring data-driven allocation. Get clarity, not clutter.
              </p>
              <div className="mt-6">
                <Link href="/optimizer" className="inline-flex items-center gap-2 rounded-lg bg-white text-emerald-700 font-semibold px-6 py-3 hover:bg-gray-100">
                  Start Building
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* --- Small Presentational Components --- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="animate-pop rounded-xl bg-white p-5 shadow-md ring-1 ring-gray-200 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-xs text-gray-600">{label}</div>
    </div>
  );
}


function HeroCard({ title, subtitle, tone }: { title: string; subtitle: string; tone: 'emerald' | 'indigo' }) {
  const color = tone === 'emerald'
    ? 'from-emerald-100 to-emerald-50 text-emerald-700 ring-emerald-200'
    : 'from-indigo-100 to-indigo-50 text-indigo-700 ring-indigo-200';
  return (
    <div className={`animate-in rounded-2xl bg-gradient-to-br ${color} p-5 shadow-md ring-1 w-[260px] sm:w-[300px]`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-gray-600/90">{subtitle}</div>
      <div className="mt-4 h-24 rounded-lg bg-white/70 ring-1 ring-black/5 grid grid-cols-6 gap-1 p-2">
        <div className="col-span-6 h-1.5 bg-emerald-500/70 rounded-full" />
        <div className="col-span-5 h-1.5 bg-indigo-500/70 rounded-full" />
        <div className="col-span-4 h-1.5 bg-emerald-500/70 rounded-full" />
        <div className="col-span-3 h-1.5 bg-indigo-500/70 rounded-full" />
        <div className="col-span-6 h-1.5 bg-emerald-500/70 rounded-full" />
      </div>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: 'research' | 'craft' | 'trust'; title: string; description: string }) {
  return (
    <div className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-indigo-100 text-emerald-700">
        {icon === 'research' ? <ResearchIcon /> : icon === 'craft' ? <CraftIcon /> : <ShieldIcon />}
      </div>
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{description}</div>
    </div>
  );
}

function TimelineItem({ title, time, description, last }: { title: string; time?: string; description: string; last?: boolean }) {
  return (
    <li className={`ms-6 pb-8 ${last ? 'pb-0' : ''}`}>
      <span className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-200" />
      <div className="animate-in">
        {time && <div className="text-xs text-gray-500">{time}</div>}
        <div className="text-base font-semibold text-gray-900">{title}</div>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </li>
  );
}

/* --- Icons --- */

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
      <path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 14l3-3 4 4 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CraftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
      <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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