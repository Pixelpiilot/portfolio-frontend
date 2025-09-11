import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import ContactForm from '../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact • Fund Craft',
  description: 'Get in touch with the Fund Craft team. Send questions, requests, or feedback.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-indigo-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-60 w-60 sm:h-72 sm:w-72 lg:h-96 lg:w-96 bg-gradient-to-br from-emerald-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-60 w-60 sm:h-72 sm:w-72 lg:h-96 lg:w-96 bg-gradient-to-tr from-indigo-400/20 to-emerald-400/20 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 py-14 sm:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium ring-1 ring-emerald-600/20">
                <SparkleIcon />
                Contact Fund Craft
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Let’s talk. We’re here to help.
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Send us your questions, ideas, or feedback.
              </p>
            </div>

            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
      <path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}