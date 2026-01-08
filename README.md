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

## Features (MVP)

- ✅ Template-first UX with 6 industry templates
- ✅ Visual drag-and-drop editor
- ✅ 5 core component types (Hero, Features, Testimonials, FAQ, CTA)
- ✅ Lead form with backend integration
- ✅ Real analytics tracking
- ✅ CDN-hosted publishing
- ✅ Custom domain support
- ✅ SEO settings
- ✅ Image optimization
- ✅ Version history (undo/redo)

## Database Setup

See `PRD_REVISED.md` section 12.2 for complete database schema and migrations.

## License

ISC
