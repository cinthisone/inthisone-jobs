'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-100/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/40 to-transparent" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              AI-Powered Job Search
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Land the Job{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Faster
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              AI-powered tools that analyze job descriptions, generate tailored cover letters, and organize your job applications in one place.
            </p>

            {/* Bullet points */}
            <ul className="mt-8 space-y-3 text-left max-w-md mx-auto lg:mx-0">
              {[
                'Track every job application',
                'Generate custom cover letters instantly',
                'Extract job details with AI',
                'Stay organized during your job search',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Start Free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                View Demo
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </div>

            {/* No credit card badge */}
            <p className="mt-4 text-sm text-slate-500 flex items-center justify-center lg:justify-start gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No credit card required to get started
            </p>
          </div>

          {/* Right side - Dashboard mockup */}
          <div className="relative">
            {/* Browser frame */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden border border-slate-200/50">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-md px-3 py-1.5 text-xs text-slate-400 text-center">
                    jobs.inthisone.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content mockup - matching real app */}
              <div className="bg-gray-50 min-h-[380px]">
                {/* App navbar mockup */}
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-indigo-600">Inthisone Jobs</div>
                    <div className="hidden sm:flex gap-2">
                      <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Dashboard</span>
                      <span className="text-xs text-gray-600">Add Job</span>
                      <span className="text-xs text-gray-600">AI Assist</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Welcome, User</div>
                </div>

                {/* Page content */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Job Applications</h2>
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md flex items-center gap-1">
                        <span>+</span> Add Job
                      </button>
                      <button className="text-xs px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-md">
                        AI Assist
                      </button>
                    </div>
                  </div>

                  {/* Job table */}
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600">
                      <div className="col-span-4">JOB TITLE</div>
                      <div className="col-span-3">COMPANY</div>
                      <div className="col-span-2">DATE</div>
                      <div className="col-span-3 text-right">ACTIONS</div>
                    </div>

                    {/* Table rows */}
                    {[
                      { title: 'Full-Stack Engineer', company: 'Columbia University', date: '11/1/2023', starred: true },
                      { title: 'Web Developer III', company: 'Chenega Corp', date: '11/2/2023', starred: false },
                      { title: 'Marketing Developer', company: 'Logix FCU', date: '11/1/2023', starred: false },
                      { title: 'Website Manager', company: 'Community College', date: '10/31/2023', starred: false },
                    ].map((job, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2.5 border-b border-slate-100 text-xs items-center hover:bg-slate-50">
                        <div className="col-span-4 font-medium text-slate-900 truncate">{job.title}</div>
                        <div className="col-span-3 text-slate-600 truncate">{job.company}</div>
                        <div className="col-span-2 text-slate-500">{job.date}</div>
                        <div className="col-span-3 flex justify-end gap-1">
                          <span className={`${job.starred ? 'text-amber-500' : 'text-slate-300'}`}>★</span>
                          <span className="text-indigo-600">View</span>
                          <span className="text-slate-600">Edit</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-slate-100 hidden lg:block animate-float">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-900">AI Analysis</div>
                  <div className="text-xs text-emerald-600">Job Parsed!</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-slate-100 hidden lg:block animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-900">Cover Letter</div>
                  <div className="text-xs text-emerald-600">Generated!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
