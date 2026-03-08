'use client';

export function ProductShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Your job search{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              command center
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A beautiful dashboard that puts everything at your fingertips.
          </p>
        </div>

        {/* Main dashboard mockup */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-purple-500/20 blur-3xl transform -translate-y-1/2" />

          {/* Dashboard frame */}
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/50 overflow-hidden">
            {/* Browser header */}
            <div className="flex items-center gap-2 px-6 py-4 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-8">
                <div className="bg-white rounded-lg px-4 py-2 text-sm text-slate-400 text-center max-w-md mx-auto">
                  jobs.inthisone.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="bg-gray-50">
              {/* App navbar */}
              <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="font-semibold text-indigo-600">Inthisone Jobs</div>
                  <div className="hidden sm:flex gap-4 text-sm">
                    <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-md font-medium">Dashboard</span>
                    <span className="text-gray-600">Add Job</span>
                    <span className="text-gray-600">AI Assist</span>
                    <span className="text-gray-600">Resumes</span>
                    <span className="text-gray-600">Notes</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Welcome, User</span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">Logout</span>
                </div>
              </div>

              {/* Page content */}
              <div className="p-6">
                {/* Header with actions */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Job Applications</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm text-slate-400">Search jobs...</span>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                      <span>+</span> Add Job
                    </button>
                    <button className="px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg">
                      AI Assist
                    </button>
                  </div>
                </div>

                {/* Job table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    <div className="col-span-3">Job Title</div>
                    <div className="col-span-2">Company</div>
                    <div className="col-span-2">Apply Date</div>
                    <div className="col-span-2">Pay Range</div>
                    <div className="col-span-1">Resume</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {/* Table rows */}
                  {[
                    { title: 'Performance Marketing Specialist', company: 'Unlock Health', date: '3/6/2026', pay: 'Not specified', starred: true },
                    { title: 'Web Developer III', company: 'Chenega Corporation', date: '11/2/2023', pay: '$105K - $115K', starred: false },
                    { title: 'Full-Stack Engineer', company: 'Columbia University', date: '11/1/2023', pay: '$80K - $98K', starred: false },
                    { title: 'Marketing Web Developer', company: 'Logix Federal Credit Union', date: '11/1/2023', pay: '$40.87 - $61.30/hr', starred: false },
                    { title: 'Website Manager', company: 'Community Colleges', date: '10/31/2023', pay: '$67K - $76K/year', starred: false },
                  ].map((job, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 text-sm items-center hover:bg-slate-50">
                      <div className="col-span-3 font-medium text-slate-900">{job.title}</div>
                      <div className="col-span-2 text-slate-600">{job.company}</div>
                      <div className="col-span-2 text-slate-500">{job.date}</div>
                      <div className="col-span-2 text-slate-500">{job.pay}</div>
                      <div className="col-span-1">
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">Resume</span>
                      </div>
                      <div className="col-span-2 flex justify-end items-center gap-3">
                        <span className={`cursor-pointer ${job.starred ? 'text-amber-500' : 'text-slate-300'}`}>★</span>
                        <span className="text-indigo-600 cursor-pointer">View</span>
                        <span className="text-slate-600 cursor-pointer">Edit</span>
                        <span className="text-red-500 cursor-pointer">Delete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature callouts */}
          <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-xl p-4 border border-slate-100 hidden xl:flex items-center gap-3 max-w-[220px]">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">AI Cover Letters</div>
              <div className="text-xs text-slate-500">Tailored to each job</div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/3 bg-white rounded-xl shadow-xl p-4 border border-slate-100 hidden xl:flex items-center gap-3 max-w-[220px]">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Interview Q&A</div>
              <div className="text-xs text-slate-500">STAR format prep</div>
            </div>
          </div>

          <div className="absolute -left-4 bottom-1/4 bg-white rounded-xl shadow-xl p-4 border border-slate-100 hidden xl:flex items-center gap-3 max-w-[220px]">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">AI Job Parsing</div>
              <div className="text-xs text-slate-500">Extract details instantly</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
