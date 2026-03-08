'use client';

import Link from 'next/link';

export function Pricing() {
  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: 'for 30 days',
      description: 'Full access to try everything',
      features: [
        'Unlimited job applications',
        'AI job parsing',
        'AI cover letter generation',
        'Resume manager',
        'Fit analysis',
        'Interview Q&A prep',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$10',
      period: '/month',
      description: 'Continue after your trial',
      features: [
        'Unlimited job applications',
        'AI job parsing',
        'AI cover letter generation',
        'Resume manager',
        'Fit analysis',
        'Interview Q&A prep',
        'Priority support',
        'Export to PDF',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start free and upgrade when you're ready for more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-2xl shadow-indigo-500/30 scale-105 z-10'
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-lg font-semibold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.highlighted ? 'text-indigo-200' : 'text-slate-500'}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.highlighted ? 'bg-white/20' : 'bg-emerald-100'
                    }`}>
                      <svg className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-emerald-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className={plan.highlighted ? 'text-white' : 'text-slate-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-slate-100 shadow-lg'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>14-day money-back guarantee on all paid plans</span>
          </div>
        </div>
      </div>
    </section>
  );
}
