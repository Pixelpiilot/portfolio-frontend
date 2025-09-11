"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [active, setActive] = useState<'home' | 'about' | 'contact' | null>('home');

  // Determine active link from URL/hash
  useEffect(() => {
    const computeActive = () => {
      if (pathname === '/about') {
        setActive('about');
      } else if (pathname === '/contact') {
        setActive('contact');
      } else if (pathname === '/') {
        setActive('home');
      } else {
        setActive(null);
      }
    };
    computeActive();
  }, [pathname]);

  // Active state now purely derived from route (pathname). Removed #about observer.

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left: Fund Crafts Logo + "Find Craft" Text */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 md:gap-3"
              aria-label="Fund Craft Home"
            >
              <span className="inline-flex items-center justify-center rounded-full p-1.5 bg-emerald-50 ring-1 ring-emerald-200 group-hover:ring-emerald-300 group-hover:shadow-sm transition">
                <Logo className="w-8 h-8 md:w-9 md:h-9" />
              </span>
              <span className="font-bold tracking-tight text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                Fund Crafts
              </span>
            </Link>
          </div>

          {/* Right: Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors font-medium ${active === 'home' ? 'text-emerald-600 font-bold' : 'text-gray-700 hover:text-emerald-600'}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`transition-colors font-medium ${active === 'about' ? 'text-emerald-600 font-bold' : 'text-gray-700 hover:text-emerald-600'}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button (right on small screens) */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div id="mobile-menu" role="menu" aria-label="Mobile navigation" className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md transition-colors font-medium hover:bg-gray-50 ${active === 'home' ? 'text-emerald-600 font-bold' : 'text-gray-700 hover:text-emerald-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md transition-colors font-medium hover:bg-gray-50 ${active === 'about' ? 'text-emerald-600 font-bold' : 'text-gray-700 hover:text-emerald-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}