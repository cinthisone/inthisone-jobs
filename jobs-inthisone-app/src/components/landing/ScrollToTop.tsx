'use client';

import { useState, useEffect } from 'react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 group flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-110 hover:-translate-y-1 active:scale-95 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      {/* Arrow icon */}
      <svg
        className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>

      {/* Ripple effect on hover */}
      <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping" />

      {/* Glow ring */}
      <span className="absolute inset-0 rounded-full border-2 border-indigo-400 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
    </button>
  );
}
