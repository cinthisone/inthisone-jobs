'use client';

export function SocialProof() {
  const companies = [
    'LinkedIn', 'Indeed', 'Glassdoor', 'Hired', 'AngelList', 'Dice'
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-slate-500 mb-8">
          Trusted by job seekers preparing for their next opportunity
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {companies.map((company) => (
            <div
              key={company}
              className="text-xl font-bold text-slate-300 hover:text-slate-400 transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
