# Product Page Builder - X.IDE v2

A Next.js-based landing page builder with template-first approach, built with Supabase backend.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Shadcn UI
- **State Management**: Jotai
- **Drag & Drop**: @dnd-kit
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Form Handling**: React Hook Form + Zod
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Get your Supabase credentials from: https://supabase.com/dashboard/project/_/settings/api

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── builder/           # Page builder interface
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── builder/          # Builder-specific components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Helper functions
├── store/                # Jotai state atoms
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## Features

### Builder Elements (11 Total)
- ✅ Announcement Bar (with countdown timer)
- ✅ Navigation Header (responsive with mobile menu)
- ✅ Hero Section (3 variants)
- ✅ Features Grid (with customizable icons)
- ✅ Testimonials (3 layout variants)
- ✅ FAQ (accordion style)
- ✅ Call to Action (enhanced customization)
- ✅ Pricing Table (cards & table layouts)
- ✅ Tabs Component (3 variants)
- ✅ Payment Button (LeanX integration)
- ✅ Footer (with social media links)

### Core Features
- ✅ Template-first UX with 6 industry templates
- ✅ Visual drag-and-drop editor with real-time preview
- ✅ Products inventory management system (Phase 10.10)
- ✅ Centralized product catalog with CRUD operations
- ✅ Real analytics tracking and dashboard
- ✅ Published pages with SEO optimization
- ✅ Subdomain support for all users
- ✅ Custom domain support (Pro tier)
- ✅ Image upload with Supabase Storage
- ✅ Auto-save functionality (2-second debounce)
- ✅ Version history (undo/redo)
- ✅ Mobile-responsive builder interface
- ✅ Payment processing integration (LeanX)
- ✅ Security hardening (RLS policies, function protection)
- ✅ Production deployment on Vercel

## Database Setup

See `PRD_REVISED.md` section 12.2 for complete database schema and migrations.

## License

ISC
