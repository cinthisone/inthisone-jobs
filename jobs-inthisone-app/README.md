# Job Tracker - AI-Powered Job Application Management

A modern, AI-powered job application tracker that helps job seekers manage their applications with intelligent automation. Built with Next.js 16, this application transforms the tedious job search process into a streamlined, organized experience.

## Why This App is Great

### The Problem
Job hunting is exhausting. You apply to dozens of positions, lose track of where you applied, forget which resume you used, and spend hours writing cover letters that may never be read. Interview prep is scattered across notes and browser tabs.

### The Solution
This app solves all of that:

- **Paste a job posting, get everything** - One paste generates a tailored cover letter, fit analysis, "Why this company?" answers, and interview prep questions
- **AI that knows your background** - Upload your resume once, and every generated document is personalized to your experience
- **Never lose track** - Every application is organized with the job description, cover letter, company info, and interview materials in one place
- **Interview confidence** - AI-generated behavioral questions with STAR-format example stories tailored to the specific role

## Features

### AI-Assisted Job Entry
The flagship feature. Paste any job posting and the AI will:
- Extract job title, company, pay range, and description
- Generate a personalized cover letter based on your resume
- Create a fit analysis showing skill matches and gaps
- Prepare "Why do you want to work here?" talking points
- Generate behavioral interview questions with answer guides (on-demand)

### Smart Dashboard
- View all applications at a glance
- Filter by favorites (star icon)
- Quick-view interview Q&A from the book icon
- See fit scores for each application

### Resume Management
- Store multiple resume versions
- AI uses the selected resume for personalized content
- Associate resumes with job applications

### Interview Preparation
- AI-generated questions based on job requirements
- Answers tailored to your experience
- STAR-format example stories
- On-demand generation to save AI tokens

### Professional Cover Letters
- AI-generated based on job posting + your resume
- Rich text editor for customization
- One-click PDF download with professional formatting
- Copy to clipboard functionality

### Notes
- General notes section for career planning
- Rich text content

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: OpenAI GPT-4
- **Payments**: Stripe (subscription model)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS

## Architecture

```
src/
├── app/
│   ├── (protected)/          # Auth-required routes
│   │   ├── dashboard/        # Main job list view
│   │   ├── jobs/
│   │   │   ├── [id]/         # Job detail & edit
│   │   │   ├── ai-assist/    # AI-powered job entry
│   │   │   └── new/          # Manual job entry
│   │   ├── resumes/          # Resume management
│   │   ├── notes/            # General notes
│   │   └── billing/          # Subscription management
│   ├── api/
│   │   ├── jobs/             # Job CRUD endpoints
│   │   ├── resumes/          # Resume endpoints
│   │   ├── parse-job/        # AI job parsing
│   │   ├── generate-interview-qa/  # On-demand Q&A
│   │   └── stripe/           # Payment webhooks
│   └── login/                # Auth page
├── components/
│   ├── JobForm.tsx           # Job create/edit form
│   ├── ResumeForm.tsx        # Resume editor
│   ├── RichTextEditor.tsx    # TipTap editor
│   └── Navbar.tsx            # Navigation
└── lib/
    ├── openai.ts             # AI generation functions
    ├── prisma.ts             # Database client
    ├── stripe.ts             # Payment integration
    ├── subscription.ts       # Access control
    └── types.ts              # TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase)
- OpenAI API key
- Google OAuth credentials
- Stripe account (for payments)

### Environment Variables

```env
# Database
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Auth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# AI
OPENAI_API_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# App
NEXTAUTH_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

### Deployment

The app is configured for Vercel deployment:

```bash
npx vercel --prod
```

## Subscription Model

- **60-day free trial** for new users
- **Stripe integration** for paid subscriptions
- **Grace period** after trial ends
- AI features require active subscription

## Key Design Decisions

1. **On-demand Interview Q&A**: Generates only when requested to save API costs
2. **Resume association**: Each job can link to a specific resume version
3. **Fit scoring**: Visual indicator of how well you match the role
4. **PDF generation**: Client-side using jsPDF for instant downloads
5. **Rich text editing**: TipTap editor for cover letter customization

## License

Private project - All rights reserved
