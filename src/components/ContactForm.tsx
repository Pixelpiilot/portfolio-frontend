"use client";
import { useState, type ReactNode } from 'react';

type Status = 'idle' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if ((formData.get('hp') as string) || (formData.get('company') as string)) {
      setStatus('success'); // silently succeed
      form.reset();
      return;
    }

    // Include rating value
    if (rating > 0) {
      formData.set('rating', String(rating));
    }

    setLoading(true);
    setStatus('idle');
    try {
      const res = await fetch('https://formspree.io/f/mgvldbyq', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.ok === true || data.ok === 'true' || !('errors' in data))) {
        setStatus('success');
        form.reset();
        setRating(0);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200 h-full">
            <h2 className="text-xl font-bold text-gray-900">We love to hear from you</h2>
            <p className="mt-2 text-sm text-gray-600">
              Questions, ideas, or issues — send us a message.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              <InfoRow
                icon="mail"
                label="Email"
                value={
                  <>
                    <a href="mailto:fundcrafts@gmail.com" className="text-emerald-700 hover:underline">
                      fundcrafts@gmail.com
                    </a>{' '}· Replies within 1–2 days
                  </>
                }
              />
              <InfoRow icon="shield" label="Privacy" value="Your details are used only to respond to your query." />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form
            action="https://formspree.io/f/mgvldbyq"
            method="POST"
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200"
          >
            <input type="text" name="hp" className="hidden" aria-hidden="true" tabIndex={-1} />
            <input type="text" name="company" className="hidden" aria-hidden="true" tabIndex={-1} />
            <input type="hidden" name="page" value="contact" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input id="name" name="name" required placeholder="Your name"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" name="email" type="email" required placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input id="subject" name="subject" placeholder="How can we help?"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <div className="mt-1 relative">
                  <select id="type" name="type"
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>General Inquiry</option>
                    <option>Feedback</option>
                    <option>Feature Request</option>
                    <option>Bug Report</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400" aria-hidden="true">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" rows={5} required placeholder="Write your message..."
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="mt-4">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                Feedback (optional)
              </label>
              <p className="text-xs text-gray-500 mt-0.5"></p>
              <textarea id="feedback" name="feedback" rows={4} placeholder="Suggest improvements, share thoughts..."
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="mt-4">
              <span className="block text-sm font-medium text-gray-700">Rating (optional)</span>
              <div className="mt-1 inline-flex items-center gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n>1?'s':''}`}
                    onClick={() => setRating(n)}
                    className={`p-1.5 rounded-md ${rating >= n ? 'text-amber-500' : 'text-gray-300'} hover:text-amber-500 transition-colors`}
                  >
                    <StarIcon />
                  </button>
                ))}
              </div>
              <input type="hidden" name="rating" value={rating ? String(rating) : ''} />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input id="consent" name="consent" type="checkbox" defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              <label htmlFor="consent" className="text-xs text-gray-600">You agree to be contacted about your message.</label>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div aria-live="polite" className="text-sm">
                {status === 'success' && (
                  <span className="text-emerald-700">Thanks! Your message has been sent.</span>
                )}
                {status === 'error' && (
                  <span className="text-red-600">Something went wrong. Please try again.</span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white font-semibold px-5 py-2.5 hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? <Spinner /> : null}
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: 'mail' | 'shield'; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-emerald-600">
        {icon === 'mail' ? <MailIcon /> : <ShieldIcon />}
      </span>
      <div>
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-600">{value}</div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}