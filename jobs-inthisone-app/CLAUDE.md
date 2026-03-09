# Job Tracker - AI Context

This is an AI-powered job application tracker built with Next.js 16.

## Project Overview

**Purpose**: Help job seekers manage applications with AI-generated content (cover letters, fit analysis, interview prep).

**Live URL**: https://jobs.inthisone.com (deployed on Vercel)

## Tech Stack

- **Next.js 16** with App Router
- **PostgreSQL** via Supabase (production) / Docker (local dev on port 5433)
- **Prisma ORM**
- **NextAuth.js** with Google OAuth
- **OpenAI GPT-4** for AI features
- **Stripe** for subscriptions
- **Tailwind CSS** for styling

## Key Files

- `src/app/(protected)/dashboard/page.tsx` - Main job list
- `src/app/(protected)/jobs/ai-assist/page.tsx` - AI job parsing flow
- `src/components/JobForm.tsx` - Job create/edit form
- `src/lib/openai.ts` - All AI generation functions
- `src/lib/subscription.ts` - Subscription access control
- `prisma/schema.prisma` - Database schema

## Common Commands

```bash
# Development
npm run dev

# Database
npx prisma db push           # Push schema to database
npx prisma generate          # Generate Prisma client
npx prisma studio            # Database GUI

# Deployment
npx vercel --prod --yes      # Deploy to production

# Type checking
npx tsc --noEmit
```

## Database

### Local Development
- Docker PostgreSQL on port 5433
- Connection: `postgresql://postgres:postgres@localhost:5433/jobtracker`

### Production
- Supabase PostgreSQL
- Uses connection pooling (port 6543 for pooled, 5432 for direct)

## AI Features

1. **parseJobPosting()** - Extract job details from pasted text
2. **generateCoverLetter()** - Create personalized cover letter
3. **generateFitAnalysis()** - Skill match/gap analysis
4. **generateWhyCompanyAnswers()** - Interview talking points
5. **generateInterviewQA()** - Behavioral questions with STAR examples

## Recent Architecture Decisions

- Interview Q&A is now **on-demand** (not auto-generated) to save AI tokens
- Jobs can be **favorited** for quick filtering
- Dashboard has **book icon** to view interview Q&A in modal
- Cover letters have **PDF download** with professional formatting

## Environment Variables

Required:
- `POSTGRES_PRISMA_URL` - Database connection (pooled)
- `POSTGRES_URL_NON_POOLING` - Database connection (direct)
- `AUTH_SECRET` - NextAuth secret
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` - Google OAuth
- `OPENAI_API_KEY` - For AI features
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRICE_ID` - Payments
