'use client';

export function Solution() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            The Solution
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            A smarter way to manage your{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              job search
            </span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            Inthisone Jobs brings together everything you need to stay organized and stand out.
            Our AI-powered platform analyzes job descriptions, generates personalized cover letters,
            and keeps all your applications in one beautiful dashboard. Stop juggling spreadsheets
            and start landing interviews.
          </p>
        </div>
      </div>
    </section>
  );
}
