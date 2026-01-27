# Headhunt V3

Premium recruitment platform for high-performance software engineering talent. Built with React, Vite, and Supabase.

## Features

- **Job Board**: Elegant interface for browsing open positions.
- **Admin Dashboard**: Secure control panel for managing postings, applications, collaborators, and ideas.
- **Project Pitching**: Community-driven "Ideas" section for internal projects.
- **Prospect Signal**: Referral system for high-quality talent and decision-makers.
- **Secure File Handling**: Signed URLs for resume storage and retrieval.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion.
- **Backend**: Node.js (Vercel Serverless Functions).
- **Database**: Supabase (PostgreSQL with RLS).
- **Storage**: Supabase Storage for PDF resumes.

## Setup & Deployment

### 1. Supabase Configuration

1. Create a new project on [Supabase](https://supabase.com).
2. Run the provided [supabase_schema.sql](./supabase_schema.sql) in the Supabase SQL Editor to set up tables, RLS policies, and storage buckets.
3. In the Supabase Dashboard, go to **Project Settings > API** to get your `URL` and `Service Role Key`.

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_dashboard_password
```

### 3. Vercel Deployment

Connect your GitHub repository to [Vercel](https://vercel.com). Vercel will automatically detect the Vite framework. Add the environment variables from your `.env` file to the Vercel project settings.

## Development

```bash
# Install dependencies
npm install

# Run local development server (Frontend @ 5173, Backend @ 3000)
npm run dev
npm run dev:server
```

## Security

- All admin routes are protected by an `ADMIN_PASSWORD` checked in serverless functions.
- Database access is controlled via Row Level Security (RLS) policies.
- Resumes are stored in a private bucket and served via short-lived signed URLs.

## License

Private / Confidential.
