# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- On-demand Interview Q&A generation
  - New API endpoint `/api/generate-interview-qa`
  - "Generate AI Questions" button in JobForm and ai-assist pages
  - Saves AI tokens by not auto-generating interview questions
- Favorite jobs feature
  - Star icon to favorite/unfavorite jobs
  - Filter dashboard by favorites
  - Favorite toggle in job detail and edit pages
- Book icon in dashboard to view Interview Q&A in modal
- Onboarding modal for new users
  - 5-step visual guide explaining how to use the app
  - Shows automatically on first visit
  - Help icon (?) in navbar to re-open anytime
  - Beautiful gradient UI with step-by-step instructions
- CLAUDE.md for AI context
- CHANGELOG.md for tracking changes
- Enhanced README.md with detailed project overview

### Changed
- Interview Q&A removed from automatic parse-job generation
- Interview Q&A section always visible with generate button

## [1.0.0] - 2025-03-07

### Added
- Initial Next.js 16 rebuild
- AI-Assisted Job Entry with job parsing
- Cover letter generation with PDF download
- Fit analysis with skill matching
- "Why This Company" answer generation
- Resume management with multiple versions
- Google OAuth authentication via NextAuth.js
- Stripe subscription integration
- 60-day free trial for new users
- Rich text editor (TipTap) for cover letters
- Dashboard with job list and search
- Notes section for general career planning
- Responsive design with Tailwind CSS
- Vercel deployment configuration
- Supabase PostgreSQL integration
