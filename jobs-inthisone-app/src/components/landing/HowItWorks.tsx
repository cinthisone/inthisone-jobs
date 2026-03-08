'use client';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Paste a job posting',
      description: 'Copy and paste the job description from any job board. Our AI instantly parses the content.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'AI extracts key information',
      description: 'Get required skills, qualifications, and a tailored cover letter suggestion in seconds.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Track and stay organized',
      description: 'Add the job to your tracker, monitor your application status, and never miss a follow-up.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Three steps to a{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              better job search
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started in minutes and let AI handle the heavy lifting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-indigo-300 to-blue-300" />
              )}

              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                  {/* Background circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full" />
                  {/* Icon circle */}
                  <div className="relative w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="text-indigo-600">
                      {step.icon}
                    </div>
                  </div>
                  {/* Step badge */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
