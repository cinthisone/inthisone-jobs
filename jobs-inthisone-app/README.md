# Inthisone Jobs - Job Application Tracker

A modern job application tracking platform built with Next.js 16, featuring AI-powered job parsing and cover letter generation.

## Features

- **Job Application Tracking**: Keep track of all job applications in one centralized dashboard
- **AI-Assisted Job Entry**: Automatically extract job details from job postings using OpenAI
- **Cover Letter Generation**: Generate tailored cover letters based on job descriptions and your resume
- **Resume Management**: Create and manage multiple resumes for different career paths
- **Search & Sort**: Easily find and organize your job applications
- **Responsive Design**: Works great on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: iron-session for secure session management
- **AI Integration**: OpenAI GPT-4 for job parsing and cover letter generation
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Vercel Postgres)
- OpenAI API key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A random 32+ character string
   - `OPENAI_API_KEY`: Your OpenAI API key

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and complete the setup wizard.

## Deployment on Vercel

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add the following environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL` (for Vercel Postgres)
   - `SESSION_SECRET`
   - `OPENAI_API_KEY`
4. Deploy!

## Project Structure

```
src/
├── app/
│   ├── (protected)/     # Authenticated routes
│   │   ├── dashboard/   # Main dashboard
│   │   ├── jobs/        # Job management pages
│   │   └── resumes/     # Resume management pages
│   ├── api/             # API routes
│   ├── login/           # Login page
│   └── setup/           # Initial setup wizard
├── components/          # React components
└── lib/                 # Utilities and configurations
```

## Default Login

After initial setup, the default credentials are:
- Username: admin
- Password: inthisonejobs2024

(Change the password after first login via the setup page)
