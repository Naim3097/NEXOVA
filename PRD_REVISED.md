# Product Requirements Document (PRD) - REVISED
## L1 Product Page Builder - Next.js + Supabase

**Version:** 2.0 (REVISED after CTO Technical Assessment)
**Last Updated:** 2026-01-05
**Status:** APPROVED FOR DEVELOPMENT
**Project Code Name:** X.IDE v2

---

## REVISION SUMMARY

### What Changed from v1.0:
1. ✅ **Backend:** Firebase → **Supabase (PostgreSQL + Realtime + Auth)**
2. ✅ **Data Model:** Redesigned for relational database (no 1MB limits)
3. ✅ **Version History:** Full snapshots → **Delta compression** (98% cost reduction)
4. ✅ **Performance:** Added virtual canvas rendering strategy
5. ✅ **Security:** Server-side API routes for payments, strict RLS policies
6. ✅ **UX:** Template-first approach (not blank canvas)
7. ✅ **Scope:** MVP focuses on landing pages (funnel in Phase 2)
8. ✅ **Timeline:** Realistic 40-week plan (not 22 weeks)
9. ✅ **Analytics:** Real tracking from day 1 (not mock data)
10. ✅ **Export:** CDN-hosted publishing (not broken HTML export)

---

## 1. Executive Summary

### 1.1 Project Overview
Build a production-ready, **template-first landing page builder** for SME business owners, freelancers, and marketers. Users can create high-converting product pages in 10 minutes by customizing professional templates, with zero coding required.

### 1.2 Core Value Proposition
- **Easy:** Choose template → Edit content → Publish (3 clicks)
- **Fast:** 10-minute page creation (vs. 2 hours with competitors)
- **Complete:** Built-in analytics, forms, payments, SEO
- **Affordable:** $19/month (vs. Webflow $39/month)

### 1.3 Target Users
1. **SME Business Owners** (70% of users)
   - Selling physical/digital products
   - Need quick landing pages for campaigns
   - Non-technical, budget-conscious

2. **Freelancers/Agencies** (20% of users)
   - Creating pages for clients
   - Need fast turnaround
   - Want white-label options

3. **Marketers** (10% of users)
   - Running ad campaigns
   - A/B testing landing pages
   - Data-driven optimization

### 1.4 Success Criteria (6 Months Post-Launch)
- ✅ User creates first page in < 10 minutes (measured via analytics)
- ✅ 70%+ of users start from templates (not blank canvas)
- ✅ Template load time < 500ms
- ✅ Canvas render time < 100ms (even with 50+ components)
- ✅ 95%+ uptime (Vercel SLA)
- ✅ User retention (D7): 40%+
- ✅ Conversion rate (free → paid): 15%+

---

## 2. Technical Stack (REVISED)

### 2.1 Frontend
| Technology | Purpose | Version | Why This Choice |
|------------|---------|---------|-----------------|
| **Next.js** | React framework (App Router) | 14.x | SSR, API routes, Vercel optimization |
| **TypeScript** | Type safety | 5.x | Strict mode enabled, catch bugs early |
| **TailwindCSS** | Styling | 3.x | Fast development, small bundle |
| **Shadcn UI** | Component library | Latest | Accessible, customizable, Radix-based |
| **Jotai** | State management | 2.x | Atomic, better than Zustand for complex state |
| **@dnd-kit** | Drag-and-drop | 6.x | Modern, performant, touch-friendly |
| **React Hook Form** | Form handling | 7.x | Best-in-class validation |
| **Recharts** | Analytics charts | 2.x | Lightweight, composable |

### 2.2 Backend (REVISED - Supabase)
| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **Supabase Auth** | Authentication | Email/password + Google OAuth, built-in MFA |
| **PostgreSQL** | Primary database | No document limits, powerful queries, ACID |
| **Supabase Realtime** | Live updates | Built-in, scales better than Firestore |
| **Supabase Storage** | File uploads | S3-compatible, CDN integration |
| **Row Level Security** | Data access control | More powerful than Firestore rules |
| **Supabase Edge Functions** | Serverless APIs | Deno runtime, fast cold starts |

### 2.3 Supporting Services
| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | Frontend hosting + API routes | $20/month (Pro) |
| **Upstash Redis** | Caching layer | $10/month (Pay-as-you-go) |
| **Resend** | Transactional emails | $20/month (50K emails) |
| **Cloudflare R2** | Published page storage | $0.015/GB (cheaper than S3) |
| **Sentry** | Error monitoring | $26/month (Team) |

### 2.4 External Integrations
| Service | Purpose | Integration Type |
|---------|---------|------------------|
| **LeanX Payment Gateway** | Payment processing | Server-side API |
| **Meta Pixel** | Facebook Ads tracking | Client-side script |
| **Google Analytics 4** | Website analytics | Client-side script |
| **Plausible** (Optional) | Privacy-friendly analytics | Alternative to GA4 |

---

## 3. Architecture Overview (REVISED)

### 3.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Next.js App (React + TypeScript)                  │    │
│  │  - Builder Interface                               │    │
│  │  - Template Gallery                                │    │
│  │  - Dashboard                                       │    │
│  └────────────────────────────────────────────────────┘    │
│         │                  │                 │              │
│         ▼                  ▼                 ▼              │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐         │
│  │  Jotai   │      │ @dnd-kit │      │  Hooks   │         │
│  │  Stores  │      │ DnD Logic│      │ (Custom) │         │
│  └──────────┘      └──────────┘      └──────────┘         │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │      VERCEL (Edge Network)       │
        │  - Static Assets (CDN)           │
        │  - API Routes (/api/*)           │
        │  - SSR/SSG Pages                 │
        └──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────────┐
        │              │                  │
        ▼              ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   SUPABASE   │ │ UPSTASH REDIS│ │ CLOUDFLARE R2│
│              │ │              │ │              │
│ PostgreSQL   │ │ Cache Layer  │ │ Published    │
│ - Projects   │ │ - Templates  │ │ Pages CDN    │
│ - Elements   │ │ - Sessions   │ │              │
│ - Versions   │ │ - Metadata   │ │              │
│ Auth         │ │              │ │              │
│ Storage      │ │              │ │              │
│ Realtime     │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│    EXTERNAL SERVICES                 │
│  - LeanX (Payments)                  │
│  - Resend (Emails)                   │
│  - Sentry (Monitoring)               │
└──────────────────────────────────────┘
```

### 3.2 Data Flow: User Edits Component

```
1. User changes headline text
   └─> Jotai store updates immediately (0ms UI update)

2. Debounced Supabase write (2 seconds)
   └─> API route validates data
   └─> PostgreSQL UPDATE query
   └─> Supabase Realtime broadcasts change

3. Version history check (background)
   └─> If 15 min since last snapshot:
       └─> Calculate delta from previous version
       └─> Store compressed diff

4. Auto-save indicator updates
   └─> "Saving..." → "Saved"
```

### 3.3 Performance Strategy

**Key Optimizations:**
1. **Virtual Canvas Rendering**
   - Only render visible components + 2 buffer zones
   - Lazy load images with blurhash placeholders
   - React.memo for all element renderers

2. **Caching Layers**
   - L1: Browser localStorage (templates, user settings)
   - L2: Redis (active projects, 5min TTL)
   - L3: PostgreSQL (source of truth)

3. **Code Splitting**
   - Route-based splitting (Next.js automatic)
   - Dynamic imports for heavy components (chart library)
   - Lazy load properties panel controls

4. **Database Optimization**
   - Indexed queries (project_id, user_id, order)
   - Prepared statements for common queries
   - Connection pooling (Supabase built-in)

---

## 4. Database Schema (PostgreSQL - REVISED)

### 4.1 Entity Relationship Diagram

```sql
users (Supabase Auth)
  ├── id (uuid, PK)
  ├── email (text)
  ├── created_at (timestamptz)
  └── metadata (jsonb)

profiles (extends users)
  ├── id (uuid, PK, FK → users.id)
  ├── display_name (text)
  ├── avatar_url (text)
  ├── subscription_plan (enum)
  ├── subscription_status (enum)
  └── settings (jsonb)

projects
  ├── id (uuid, PK)
  ├── user_id (uuid, FK → profiles.id)
  ├── name (text)
  ├── slug (text, unique)
  ├── status (enum: draft, published)
  ├── element_count (int4)
  ├── current_version (int4)
  ├── published_url (text)
  ├── seo_settings (jsonb)
  ├── integrations (jsonb)
  ├── created_at (timestamptz)
  └── updated_at (timestamptz)

elements
  ├── id (uuid, PK)
  ├── project_id (uuid, FK → projects.id)
  ├── type (text)
  ├── order (int4)
  ├── props (jsonb)
  ├── version (int4)  -- for optimistic locking
  ├── created_at (timestamptz)
  └── updated_at (timestamptz)

project_versions
  ├── id (uuid, PK)
  ├── project_id (uuid, FK → projects.id)
  ├── version_number (int4)
  ├── snapshot_type (enum: full, delta)
  ├── data (jsonb)  -- full snapshot or delta
  ├── base_version (int4)  -- for delta reconstruction
  ├── created_by (uuid, FK → profiles.id)
  ├── is_auto_save (boolean)
  ├── label (text, nullable)
  └── created_at (timestamptz)

templates
  ├── id (uuid, PK)
  ├── name (text)
  ├── slug (text, unique)
  ├── category (text)
  ├── industry (text)
  ├── description (text)
  ├── thumbnail_url (text)
  ├── preview_url (text)
  ├── data (jsonb)  -- elements + settings
  ├── is_public (boolean)
  ├── usage_count (int4)
  ├── tags (text[])
  ├── created_at (timestamptz)
  └── updated_at (timestamptz)

form_submissions
  ├── id (uuid, PK)
  ├── project_id (uuid, FK → projects.id)
  ├── form_id (text)
  ├── data (jsonb)
  ├── ip_address (inet)
  ├── user_agent (text)
  ├── submitted_at (timestamptz)

analytics_events
  ├── id (uuid, PK)
  ├── project_id (uuid, FK → projects.id)
  ├── event_type (text)
  ├── session_id (text)
  ├── device_type (text)
  ├── metadata (jsonb)
  └── created_at (timestamptz)

-- Indexes for performance
CREATE INDEX idx_elements_project_order ON elements(project_id, order);
CREATE INDEX idx_versions_project ON project_versions(project_id, version_number DESC);
CREATE INDEX idx_analytics_project_date ON analytics_events(project_id, created_at DESC);
CREATE INDEX idx_templates_category ON templates(category, is_public) WHERE is_public = true;
```

### 4.2 Row Level Security (RLS) Policies

```sql
-- Users can only access their own projects
CREATE POLICY "Users can CRUD their own projects"
  ON projects
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Elements inherit project access
CREATE POLICY "Users can CRUD elements in their projects"
  ON elements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = elements.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Version history is read-only via API
CREATE POLICY "Users can read version history for their projects"
  ON project_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_versions.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Templates are public read
CREATE POLICY "Anyone can read public templates"
  ON templates
  FOR SELECT
  USING (is_public = true);

-- Form submissions are project-scoped
CREATE POLICY "Users can read form submissions for their projects"
  ON form_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = form_submissions.project_id
        AND projects.user_id = auth.uid()
    )
  );
```

### 4.3 Database Functions (Performance Optimization)

```sql
-- Efficiently get project with all elements (single query)
CREATE OR REPLACE FUNCTION get_project_with_elements(project_id_param uuid)
RETURNS TABLE(
  project jsonb,
  elements jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_jsonb(p.*) as project,
    jsonb_agg(to_jsonb(e.*) ORDER BY e.order) as elements
  FROM projects p
  LEFT JOIN elements e ON e.project_id = p.id
  WHERE p.id = project_id_param
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment template usage count atomically
CREATE OR REPLACE FUNCTION increment_template_usage(template_id_param uuid)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET usage_count = usage_count + 1
  WHERE id = template_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create project from template (atomic transaction)
CREATE OR REPLACE FUNCTION create_project_from_template(
  template_id_param uuid,
  user_id_param uuid,
  project_name_param text
)
RETURNS uuid AS $$
DECLARE
  new_project_id uuid;
  template_data jsonb;
BEGIN
  -- Get template data
  SELECT data INTO template_data
  FROM templates
  WHERE id = template_id_param AND is_public = true;

  IF template_data IS NULL THEN
    RAISE EXCEPTION 'Template not found or not public';
  END IF;

  -- Create project
  INSERT INTO projects (user_id, name, status, element_count)
  VALUES (user_id_param, project_name_param, 'draft', 0)
  RETURNING id INTO new_project_id;

  -- Copy elements from template
  INSERT INTO elements (project_id, type, "order", props)
  SELECT
    new_project_id,
    elem->>'type',
    (elem->>'order')::int4,
    elem->'props'
  FROM jsonb_array_elements(template_data->'elements') elem;

  -- Update element count
  UPDATE projects
  SET element_count = (SELECT COUNT(*) FROM elements WHERE project_id = new_project_id)
  WHERE id = new_project_id;

  -- Increment template usage
  PERFORM increment_template_usage(template_id_param);

  RETURN new_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Feature Requirements (REVISED - MVP First)

### 5.1 MVP Scope (Phase 1 - Landing Page Builder)

#### ✅ Feature Set: Landing Page Builder Only

**INCLUDED in MVP:**
- ✅ Template-first UX (6 industry templates)
- ✅ Visual editor (simple mode: text, images, colors)
- ✅ 5 core component types (Hero, Features, Testimonials, FAQ, CTA)
- ✅ Lead form with backend
- ✅ Real analytics (page views, conversions)
- ✅ CDN-hosted publishing
- ✅ Custom domain support
- ✅ SEO settings
- ✅ Image optimization
- ✅ Version history (undo/redo)

**EXCLUDED from MVP (Phase 2):**
- ❌ Sales funnel (Checkout, Upsell, Thank You)
- ❌ Inventory management
- ❌ Payment processing
- ❌ Advanced component library (Pricing tables, multi-step forms)
- ❌ A/B testing
- ❌ Team collaboration

**Rationale:**
- MVP validates core value: "Quick landing page creation"
- Sales funnel adds 8 weeks of complexity
- Can add funnel after proving landing page builder works

---

### 5.2 Detailed Feature Specifications

#### A. Template Gallery (Template-First Approach)

**User Flow:**
```
1. User clicks "Create New Project"
2. Modal shows: "Choose a template to get started"
3. Gallery displays 6 templates with preview images
4. Hover shows "Preview" and "Use Template" buttons
5. Click "Use Template" → Project created in 2 seconds
6. User lands in builder with pre-filled content
```

**Templates (6 Industries):**

| Template | Industry | Components | Use Case |
|----------|----------|------------|----------|
| **SaaS Landing** | Technology | Hero + Features + Pricing + FAQ + CTA | Software product launch |
| **E-commerce Product** | Retail | Hero + Product Grid + Testimonials + CTA | Selling physical goods |
| **Course Sales** | Education | Hero (Video) + Curriculum + Instructor + FAQ | Online course launch |
| **Lead Gen** | Services | Hero + Benefits + Lead Form + Social Proof | B2B service landing page |
| **Event Registration** | Events | Hero + Agenda + Speakers + Registration Form | Conference/webinar |
| **Portfolio** | Creative | Hero + Projects + About + Contact | Freelancer showcase |

**Template Metadata:**
```typescript
interface Template {
  id: string;
  name: string;
  slug: string;
  category: 'saas' | 'ecommerce' | 'course' | 'leadgen' | 'event' | 'portfolio';
  industry: string;
  description: string;
  thumbnailUrl: string;      // 400×300px preview image
  previewUrl: string;         // Full-page screenshot
  tags: string[];             // ['modern', 'blue', 'video']
  elementCount: number;
  estimatedSetupTime: number; // minutes
  conversionRate: number;     // benchmark (e.g., 18% avg)
  usageCount: number;         // popularity
  data: {
    elements: Element[];
    seoSettings: SEOSettings;
    theme: {
      primaryColor: string;
      fontFamily: string;
    };
  };
}
```

**Implementation Details:**
- Templates stored in PostgreSQL `templates` table
- Cached in Redis for 24 hours
- Lazy-loaded images with blurhash placeholders
- Search & filter by category, industry, tags
- Sort by: Popular, Newest, Conversion Rate

---

#### B. Visual Editor (Simple Mode - MVP)

**Canvas Features:**
- **Device Toggle:** Desktop (1280px), Tablet (768px), Mobile (375px)
- **Zoom:** 50%, 75%, 100%, 125%, 150%
- **Grid Background:** Optional snap-to-grid
- **Virtual Rendering:** Only render visible + 2 buffer zones
- **Keyboard Shortcuts:**
  - `Cmd+Z` / `Ctrl+Z`: Undo
  - `Cmd+Shift+Z`: Redo
  - `Backspace` / `Delete`: Delete selected element
  - `Cmd+D`: Duplicate element
  - `Cmd+S`: Manual save

**Component Library (5 Core Types):**

1. **Hero Section**
   ```typescript
   {
     type: 'hero',
     variants: ['image_left', 'video_bg', 'centered'],
     editableProps: [
       { key: 'headline', type: 'text', maxLength: 100 },
       { key: 'subheadline', type: 'textarea', maxLength: 300 },
       { key: 'ctaText', type: 'text', maxLength: 30 },
       { key: 'ctaUrl', type: 'text', pattern: 'url' },
       { key: 'image', type: 'image', maxSize: '5MB' },
       { key: 'bgColor', type: 'color' },
     ]
   }
   ```

2. **Features Section**
   ```typescript
   {
     type: 'features',
     variants: ['grid', 'list', 'alternating'],
     editableProps: [
       { key: 'title', type: 'text' },
       { key: 'features', type: 'array', itemSchema: [
         { key: 'icon', type: 'icon', library: 'lucide' },
         { key: 'title', type: 'text', maxLength: 50 },
         { key: 'description', type: 'textarea', maxLength: 200 },
       ]}
     ]
   }
   ```

3. **Testimonials**
   ```typescript
   {
     type: 'testimonials',
     variants: ['slider', 'grid', 'masonry'],
     editableProps: [
       { key: 'title', type: 'text' },
       { key: 'testimonials', type: 'array', itemSchema: [
         { key: 'name', type: 'text' },
         { key: 'role', type: 'text' },
         { key: 'avatar', type: 'image' },
         { key: 'quote', type: 'textarea', maxLength: 500 },
         { key: 'rating', type: 'number', min: 1, max: 5 },
       ]}
     ]
   }
   ```

4. **FAQ Accordion**
   ```typescript
   {
     type: 'faq',
     variants: ['single_column', 'two_column'],
     editableProps: [
       { key: 'title', type: 'text' },
       { key: 'questions', type: 'array', itemSchema: [
         { key: 'question', type: 'text', maxLength: 200 },
         { key: 'answer', type: 'textarea', maxLength: 1000 },
       ]}
     ]
   }
   ```

5. **CTA (Call-to-Action)**
   ```typescript
   {
     type: 'cta',
     variants: ['centered', 'split', 'banner'],
     editableProps: [
       { key: 'headline', type: 'text' },
       { key: 'description', type: 'textarea' },
       { key: 'buttonText', type: 'text' },
       { key: 'buttonUrl', type: 'text' },
       { key: 'bgGradient', type: 'gradient' },
     ]
   }
   ```

**Properties Panel (Dynamic Controls):**
- Auto-generates UI based on component schema
- Groups related props (Content, Style, Advanced)
- Collapsible sections
- Real-time validation
- Inline error messages

**Drag-and-Drop Behavior:**
```typescript
// Using @dnd-kit
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function Canvas() {
  const elements = useElements();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // Reorder elements
      reorderElements(active.id, over.id);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={elements} strategy={verticalListSortingStrategy}>
        {elements.map((el) => (
          <SortableElement key={el.id} element={el} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

---

#### C. Lead Form System (with Backend)

**Form Builder:**
```typescript
interface FormConfig {
  formId: string;
  title: string;
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  notifications: {
    email: string;      // Owner email
    webhook?: string;   // Optional CRM webhook
  };
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder: string;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}
```

**Form Submission Flow:**
```
1. User fills form on published page
2. Client-side validation (React Hook Form)
3. POST /api/forms/submit
   ├─> Verify reCAPTCHA
   ├─> Validate data against schema
   ├─> Save to database (form_submissions table)
   ├─> Send email notification (Resend)
   └─> Trigger webhook (if configured)
4. Show success message or redirect
```

**API Endpoint:**
```typescript
// app/api/forms/submit/route.ts
export async function POST(req: Request) {
  const { projectId, formId, data, captchaToken } = await req.json();

  // 1. Verify captcha
  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return Response.json({ error: 'Invalid captcha' }, { status: 400 });
  }

  // 2. Get project and validate form exists
  const project = await supabase
    .from('projects')
    .select('*, elements!inner(*)')
    .eq('id', projectId)
    .single();

  const formElement = project.elements.find(
    (el) => el.type === 'form' && el.props.formId === formId
  );

  if (!formElement) {
    return Response.json({ error: 'Form not found' }, { status: 404 });
  }

  // 3. Validate submitted data
  const validationResult = validateFormData(data, formElement.props.fields);
  if (!validationResult.valid) {
    return Response.json({ error: validationResult.error }, { status: 400 });
  }

  // 4. Save to database
  const { data: submission, error } = await supabase
    .from('form_submissions')
    .insert({
      project_id: projectId,
      form_id: formId,
      data: data,
      ip_address: req.headers.get('x-forwarded-for'),
      user_agent: req.headers.get('user-agent'),
    })
    .select()
    .single();

  // 5. Send email notification
  await resend.emails.send({
    from: 'forms@yourapp.com',
    to: formElement.props.notifications.email,
    subject: `New form submission from ${project.name}`,
    react: FormSubmissionEmail({ data, projectName: project.name }),
  });

  // 6. Webhook (if configured)
  if (formElement.props.notifications.webhook) {
    await fetch(formElement.props.notifications.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission }),
    });
  }

  return Response.json({ success: true, submissionId: submission.id });
}
```

---

#### D. Real Analytics (Not Mock Data)

**Analytics System Architecture:**
```
Published Page →
  Embedded tracking script →
  POST /api/analytics/track →
  PostgreSQL (analytics_events) →
  Aggregated queries for dashboard
```

**Tracked Events:**
```typescript
type AnalyticsEvent =
  | { type: 'page_view'; url: string; referrer: string; }
  | { type: 'button_click'; elementId: string; text: string; }
  | { type: 'form_view'; formId: string; }
  | { type: 'form_submit'; formId: string; success: boolean; }
  | { type: 'scroll_depth'; percentage: number; }
  | { type: 'time_on_page'; duration: number; };

interface AnalyticsMetadata {
  sessionId: string;        // UUID for session
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  os: string;
  country: string;          // From IP geolocation
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
```

**Tracking Script (Embedded in Published Pages):**
```typescript
// public/analytics.js (minified, < 5KB)
(function() {
  const projectId = document.currentScript.getAttribute('data-project-id');
  const sessionId = getOrCreateSessionId();
  const API_URL = 'https://yourapp.com/api/analytics/track';

  // Track page view
  sendEvent('page_view', {
    url: window.location.href,
    referrer: document.referrer,
  });

  // Track button clicks (with event delegation)
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button, a[href]');
    if (button) {
      sendEvent('button_click', {
        elementId: button.getAttribute('data-element-id'),
        text: button.textContent.trim(),
      });
    }
  });

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', throttle(() => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercentage > maxScroll && scrollPercentage % 25 === 0) {
      maxScroll = scrollPercentage;
      sendEvent('scroll_depth', { percentage: scrollPercentage });
    }
  }, 1000));

  function sendEvent(type, data) {
    navigator.sendBeacon(API_URL, JSON.stringify({
      projectId,
      sessionId,
      type,
      data,
      metadata: getMetadata(),
      timestamp: Date.now(),
    }));
  }
})();
```

**Analytics Dashboard Queries:**
```sql
-- Daily page views (last 30 days)
SELECT
  DATE(created_at) as date,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_visitors
FROM analytics_events
WHERE project_id = $1
  AND event_type = 'page_view'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Conversion rate (form submissions / page views)
WITH views AS (
  SELECT COUNT(DISTINCT session_id) as total
  FROM analytics_events
  WHERE project_id = $1 AND event_type = 'page_view'
    AND created_at >= NOW() - INTERVAL '30 days'
),
conversions AS (
  SELECT COUNT(DISTINCT session_id) as total
  FROM analytics_events
  WHERE project_id = $1 AND event_type = 'form_submit'
    AND created_at >= NOW() - INTERVAL '30 days'
    AND (metadata->>'success')::boolean = true
)
SELECT
  ROUND((conversions.total::float / views.total * 100), 2) as conversion_rate
FROM views, conversions;

-- Top traffic sources
SELECT
  metadata->>'utmSource' as source,
  COUNT(DISTINCT session_id) as visitors,
  COUNT(*) FILTER (WHERE event_type = 'form_submit') as conversions
FROM analytics_events
WHERE project_id = $1
  AND created_at >= NOW() - INTERVAL '30 days'
  AND metadata->>'utmSource' IS NOT NULL
GROUP BY metadata->>'utmSource'
ORDER BY visitors DESC
LIMIT 10;

-- Device breakdown
SELECT
  metadata->>'deviceType' as device,
  COUNT(DISTINCT session_id) as visitors,
  ROUND(COUNT(DISTINCT session_id)::float /
    (SELECT COUNT(DISTINCT session_id) FROM analytics_events
     WHERE project_id = $1 AND created_at >= NOW() - INTERVAL '30 days') * 100, 1
  ) as percentage
FROM analytics_events
WHERE project_id = $1
  AND event_type = 'page_view'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY metadata->>'deviceType';
```

**Analytics Dashboard UI:**
```typescript
function AnalyticsDashboard({ projectId }: { projectId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', projectId],
    queryFn: () => fetch(`/api/analytics/${projectId}`).then(r => r.json()),
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="Page Views" value={data.totalViews} change="+12%" />
        <MetricCard title="Unique Visitors" value={data.uniqueVisitors} change="+8%" />
        <MetricCard title="Conversion Rate" value={`${data.conversionRate}%`} change="+2.3%" />
        <MetricCard title="Avg. Time on Page" value={`${data.avgTimeOnPage}s`} change="-5%" />
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyViews}>
              <Line type="monotone" dataKey="views" stroke="#2563eb" />
              <Line type="monotone" dataKey="unique_visitors" stroke="#16a34a" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Visitors</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topSources.map((source) => (
                <TableRow key={source.source}>
                  <TableCell>{source.source}</TableCell>
                  <TableCell>{source.visitors}</TableCell>
                  <TableCell>{source.conversions}</TableCell>
                  <TableCell>{(source.conversions / source.visitors * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### E. Publishing System (CDN-Hosted)

**Publishing Flow:**
```
1. User clicks "Publish" button
2. Modal shows publishing options:
   ├─> Generate public URL (yourproject.yourapp.com)
   ├─> Custom domain (myproduct.com)
   └─> Embed code (iframe)
3. System builds static site:
   ├─> Render React components to HTML
   ├─> Inline critical CSS
   ├─> Bundle minimal JS (analytics + forms)
   ├─> Optimize images (WebP + responsive sizes)
4. Upload to Cloudflare R2
5. Deploy to Vercel Edge (for custom domains)
6. Return published URL
```

**Static Site Generation:**
```typescript
// app/api/projects/[id]/publish/route.ts
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: projectId } = params;

  // 1. Get project with elements
  const { data: project } = await supabase
    .from('projects')
    .select('*, elements(*)')
    .eq('id', projectId)
    .single();

  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 });
  }

  // 2. Generate static HTML
  const html = await generateStaticHTML({
    elements: project.elements,
    seoSettings: project.seo_settings,
    projectId: project.id,
  });

  // 3. Generate slug (if not exists)
  const slug = project.slug || generateUniqueSlug(project.name);

  // 4. Upload to Cloudflare R2
  const r2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  await r2.send(new PutObjectCommand({
    Bucket: 'published-pages',
    Key: `${slug}/index.html`,
    Body: html,
    ContentType: 'text/html',
    CacheControl: 'public, max-age=3600',
  }));

  // 5. Update project with published URL
  const publishedUrl = `https://${slug}.yourapp.com`;

  await supabase
    .from('projects')
    .update({
      status: 'published',
      published_url: publishedUrl,
      published_at: new Date().toISOString(),
      slug: slug,
    })
    .eq('id', projectId);

  // 6. Invalidate CDN cache
  await fetch('https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: [publishedUrl] }),
  });

  return Response.json({
    success: true,
    url: publishedUrl,
    embedCode: `<iframe src="${publishedUrl}" width="100%" height="800px" frameborder="0"></iframe>`,
  });
}

async function generateStaticHTML(options: {
  elements: Element[];
  seoSettings: SEOSettings;
  projectId: string;
}) {
  const { elements, seoSettings, projectId } = options;

  // Render React components to HTML string
  const bodyHTML = renderToString(
    <PageRenderer elements={elements} />
  );

  // Extract critical CSS (Tailwind used in components)
  const criticalCSS = await extractCriticalCSS(bodyHTML);

  // Generate final HTML
  return `
<!DOCTYPE html>
<html lang="${seoSettings.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(seoSettings.title)}</title>
  <meta name="description" content="${escapeHtml(seoSettings.description)}">
  ${seoSettings.keywords ? `<meta name="keywords" content="${escapeHtml(seoSettings.keywords.join(', '))}">` : ''}

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(seoSettings.title)}">
  <meta property="og:description" content="${escapeHtml(seoSettings.description)}">
  ${seoSettings.ogImage ? `<meta property="og:image" content="${escapeHtml(seoSettings.ogImage)}">` : ''}
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(seoSettings.title)}">
  <meta name="twitter:description" content="${escapeHtml(seoSettings.description)}">

  <!-- Canonical -->
  ${seoSettings.canonicalUrl ? `<link rel="canonical" href="${escapeHtml(seoSettings.canonicalUrl)}">` : ''}

  <!-- Critical CSS -->
  <style>${criticalCSS}</style>

  <!-- Fonts (if used) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Analytics Script -->
  <script async src="/analytics.js" data-project-id="${projectId}"></script>
</head>
<body>
  ${bodyHTML}

  <!-- Minimal runtime for forms and interactions -->
  <script src="/runtime.js" defer></script>
</body>
</html>
  `.trim();
}
```

**Custom Domain Setup:**
```typescript
// app/api/projects/[id]/domains/route.ts
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { domain } = await req.json();  // e.g., "myproduct.com"

  // 1. Validate domain ownership (DNS TXT record)
  const txtRecord = await resolveDNS(domain, 'TXT');
  const verificationCode = txtRecord.find(r =>
    r.includes(`yourapp-verification=${params.id}`)
  );

  if (!verificationCode) {
    return Response.json({
      error: 'Domain not verified',
      instructions: `Add TXT record: yourapp-verification=${params.id}`,
    }, { status: 400 });
  }

  // 2. Add domain to Vercel project
  const vercelResponse = await fetch('https://api.vercel.com/v10/projects/{project_id}/domains', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: domain }),
  });

  if (!vercelResponse.ok) {
    return Response.json({ error: 'Failed to add domain' }, { status: 500 });
  }

  // 3. Save to database
  await supabase
    .from('custom_domains')
    .insert({
      project_id: params.id,
      domain: domain,
      verified: true,
      ssl_enabled: true,
    });

  return Response.json({
    success: true,
    domain: domain,
    instructions: [
      `Add CNAME record: ${domain} → cname.vercel-dns.com`,
      'SSL certificate will be provisioned automatically (may take up to 24 hours)',
    ],
  });
}
```

---

#### F. SEO Settings

```typescript
interface SEOSettings {
  // Basic
  title: string;                    // <title> tag (max 60 chars)
  description: string;              // meta description (max 160 chars)
  keywords: string[];               // meta keywords (optional, mostly ignored by Google)

  // Open Graph (Social Sharing)
  ogTitle?: string;                 // Defaults to title
  ogDescription?: string;           // Defaults to description
  ogImage?: string;                 // 1200×630px recommended
  ogType: 'website' | 'article' | 'product';

  // Twitter Card
  twitterCard: 'summary' | 'summary_large_image';
  twitterSite?: string;             // @username

  // Technical SEO
  canonicalUrl?: string;            // Prevent duplicate content
  robotsIndex: boolean;             // Allow indexing (default: true)
  robotsFollow: boolean;            // Allow following links (default: true)

  // Structured Data (JSON-LD)
  structuredData?: {
    '@context': 'https://schema.org';
    '@type': 'Product' | 'Event' | 'FAQPage' | 'Article';
    [key: string]: any;
  };

  // Performance
  preloadAssets?: string[];         // Critical resources to preload

  // Language & Region
  language: string;                 // e.g., 'en', 'ms'
  hreflang?: Array<{                // Multi-language support
    lang: string;
    url: string;
  }>;
}
```

**SEO Settings UI:**
```typescript
function SEOSettingsPanel({ projectId }: { projectId: string }) {
  const { data: project } = useProject(projectId);
  const { mutate: updateSEO } = useUpdateProject();

  return (
    <Form>
      <FormField name="title" label="Page Title" help="Appears in Google search results">
        <Input maxLength={60} />
        <CharacterCount current={title.length} max={60} />
      </FormField>

      <FormField name="description" label="Meta Description">
        <Textarea maxLength={160} />
        <CharacterCount current={description.length} max={160} />
      </FormField>

      <FormField name="ogImage" label="Social Sharing Image">
        <ImageUploader
          aspectRatio={1200 / 630}
          help="Recommended: 1200×630px"
        />
      </FormField>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Google Search Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="google-preview">
            <div className="url">{project.published_url}</div>
            <div className="title">{seoSettings.title}</div>
            <div className="description">{seoSettings.description}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs>
            <TabsList>
              <TabsTrigger>Facebook</TabsTrigger>
              <TabsTrigger>Twitter</TabsTrigger>
              <TabsTrigger>LinkedIn</TabsTrigger>
            </TabsList>
            <TabsContent>
              <SocialPreview platform="facebook" settings={seoSettings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Button onClick={() => updateSEO({ id: projectId, seo_settings: seoSettings })}>
        Save SEO Settings
      </Button>
    </Form>
  );
}
```

---

#### G. Image Optimization Pipeline

**Upload Flow:**
```
1. User uploads image (max 10MB)
2. Client-side compression:
   ├─> Resize to max 2000×2000px
   ├─> Compress to 85% quality
   ├─> Convert to WebP if browser supports
3. Upload to Supabase Storage
4. Trigger Edge Function for processing
5. Edge Function generates:
   ├─> Multiple sizes (sm: 640w, md: 1024w, lg: 1920w)
   ├─> WebP and AVIF versions
   ├─> Blurhash placeholder (base64, ~30 bytes)
6. Store metadata in database
7. Return optimized URLs
```

**Implementation:**
```typescript
// Client-side upload
async function handleImageUpload(file: File) {
  // 1. Compress before upload
  const compressed = await compressImage(file, {
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 0.85,
    mimeType: 'image/webp',
  });

  // 2. Upload to Supabase Storage
  const fileName = `${uuid()}.webp`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, compressed, {
      cacheControl: '31536000',  // 1 year
      upsert: false,
    });

  if (error) throw error;

  // 3. Trigger optimization (Edge Function)
  const { data: optimized } = await supabase.functions.invoke('optimize-image', {
    body: { fileName },
  });

  return optimized.urls;
}

// Supabase Edge Function (Deno)
// supabase/functions/optimize-image/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

serve(async (req) => {
  const { fileName } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Download original
  const { data: original } = await supabase.storage
    .from('images')
    .download(fileName);

  const buffer = await original.arrayBuffer();

  // 2. Generate multiple sizes using Sharp (or Cloudflare Images API)
  const sizes = [640, 1024, 1920];
  const variants = [];

  for (const width of sizes) {
    // WebP
    const webp = await resizeAndConvert(buffer, width, 'webp');
    const webpFileName = `${fileName.replace('.webp', '')}-${width}w.webp`;
    await supabase.storage.from('images').upload(webpFileName, webp);
    variants.push({ width, format: 'webp', url: getPublicUrl(webpFileName) });

    // AVIF (smaller, better quality)
    const avif = await resizeAndConvert(buffer, width, 'avif');
    const avifFileName = `${fileName.replace('.webp', '')}-${width}w.avif`;
    await supabase.storage.from('images').upload(avifFileName, avif);
    variants.push({ width, format: 'avif', url: getPublicUrl(avifFileName) });
  }

  // 3. Generate blurhash
  const blurhash = await generateBlurhash(buffer);

  // 4. Return optimized URLs
  return new Response(JSON.stringify({
    original: getPublicUrl(fileName),
    variants: variants,
    blurhash: blurhash,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**Using Optimized Images in Components:**
```typescript
function OptimizedImage({ src, alt, ...props }: ImageProps) {
  const imageData = useImageMetadata(src);

  return (
    <picture>
      {/* AVIF (best quality, smallest size) */}
      <source
        type="image/avif"
        srcSet={`
          ${imageData.variants.find(v => v.width === 640 && v.format === 'avif')?.url} 640w,
          ${imageData.variants.find(v => v.width === 1024 && v.format === 'avif')?.url} 1024w,
          ${imageData.variants.find(v => v.width === 1920 && v.format === 'avif')?.url} 1920w
        `}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* WebP (fallback) */}
      <source
        type="image/webp"
        srcSet={`
          ${imageData.variants.find(v => v.width === 640 && v.format === 'webp')?.url} 640w,
          ${imageData.variants.find(v => v.width === 1024 && v.format === 'webp')?.url} 1024w,
          ${imageData.variants.find(v => v.width === 1920 && v.format === 'webp')?.url} 1920w
        `}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Original (fallback for old browsers) */}
      <img
        src={imageData.original}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          backgroundImage: `url(${imageData.blurhash})`,
          backgroundSize: 'cover',
        }}
        {...props}
      />
    </picture>
  );
}
```

---

#### H. Version History & Undo/Redo (REVISED)

**Delta-Based Version System:**

```typescript
// Changed from full snapshots to delta compression

interface VersionDelta {
  id: string;
  projectId: string;
  versionNumber: number;
  snapshotType: 'full' | 'delta';

  // For full snapshots
  data?: {
    elements: Element[];
    projectSettings: any;
  };

  // For delta snapshots
  changes?: Array<{
    op: 'add' | 'update' | 'delete';
    elementId: string;
    path?: string;           // JSONPath for nested updates
    oldValue?: any;
    newValue?: any;
  }>;

  baseVersion?: number;      // Which version this delta is based on

  createdBy: string;
  isAutoSave: boolean;
  label?: string;
  createdAt: Date;
}
```

**Versioning Strategy:**
- **Full snapshot:** Every 50 changes OR every 24 hours
- **Delta snapshot:** Every 15 minutes (if changes exist)
- **In-session undo/redo:** Command pattern (in memory, not saved to DB)

**Command Pattern for Undo/Redo:**
```typescript
interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}

class UpdateElementCommand implements Command {
  constructor(
    private elementId: string,
    private key: string,
    private oldValue: any,
    private newValue: any,
    private store: ProjectStore
  ) {}

  execute() {
    this.store.updateElement(this.elementId, { [this.key]: this.newValue });
  }

  undo() {
    this.store.updateElement(this.elementId, { [this.key]: this.oldValue });
  }

  redo() {
    this.execute();
  }
}

class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;
  private maxHistorySize = 100;

  execute(command: Command) {
    // Remove any commands after current index
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Execute command
    command.execute();

    // Add to history
    this.history.push(command);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo() {
    if (this.canUndo()) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      this.history[this.currentIndex].redo();
    }
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}

// Usage in component
const commandManager = useCommandManager();

function updateHeadline(elementId: string, newValue: string) {
  const element = elements.find(el => el.id === elementId);
  const command = new UpdateElementCommand(
    elementId,
    'headline',
    element.props.headline,  // old value
    newValue,                // new value
    projectStore
  );

  commandManager.execute(command);
}

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        commandManager.redo();
      } else {
        commandManager.undo();
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

**Version History UI:**
```typescript
function VersionHistoryPanel({ projectId }: { projectId: string }) {
  const { data: versions } = useQuery({
    queryKey: ['versions', projectId],
    queryFn: () => fetch(`/api/projects/${projectId}/versions`).then(r => r.json()),
  });

  const { mutate: restoreVersion } = useMutation({
    mutationFn: async (versionId: string) => {
      return fetch(`/api/projects/${projectId}/versions/${versionId}/restore`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      // Reload project
      queryClient.invalidateQueries(['project', projectId]);
    },
  });

  return (
    <div className="version-history">
      <div className="header">
        <h3>Version History</h3>
        <Button onClick={() => createManualSnapshot()}>
          Create Snapshot
        </Button>
      </div>

      <div className="timeline">
        {versions.map((version) => (
          <div key={version.id} className="version-item">
            <div className="timestamp">
              {formatDistanceToNow(version.createdAt)} ago
            </div>

            <div className="label">
              {version.label || (version.isAutoSave ? 'Auto-save' : 'Manual snapshot')}
            </div>

            {version.snapshotType === 'delta' && (
              <div className="changes">
                {version.changes.length} change{version.changes.length > 1 ? 's' : ''}
              </div>
            )}

            <div className="actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => previewVersion(version.id)}
              >
                Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => restoreVersion(version.id)}
              >
                Restore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Cost Comparison:**
```
Before (Full Snapshots):
- 16 snapshots/day × 100KB each = 1.6MB/day/user
- 1000 users × 1.6MB × 30 days = 48GB/month
- Storage cost: $0.026/GB × 48GB = $1,248/month

After (Delta Compression):
- 1 full snapshot/day × 100KB = 100KB
- 15 deltas × 2KB each = 30KB
- Total: 130KB/day/user
- 1000 users × 130KB × 30 days = 3.9GB/month
- Storage cost: $0.026/GB × 3.9GB = $101/month

Savings: 92% reduction ($1,147/month saved)
```

---

## 6. User Onboarding & Help System

### 6.1 First-Time User Experience

**Onboarding Flow:**
```
1. User signs up
2. Welcome modal:
   ├─> "What do you want to build?"
   ├─> Options: Product page, Lead gen, Event, Portfolio
   └─> User selects option
3. Template gallery filtered by selection
4. User chooses template
5. Guided tour starts:
   ├─> Step 1: "This is your canvas"
   ├─> Step 2: "Click any text to edit"
   ├─> Step 3: "Upload your logo here"
   ├─> Step 4: "Change colors in this panel"
   ├─> Step 5: "Click Publish when ready"
6. User builds page (with hints)
7. First publish → Celebration modal + Share link
```

**Shepherd.js Implementation:**
```typescript
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

function useOnboardingTour() {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      classes: 'shepherd-theme-custom',
      scrollTo: { behavior: 'smooth', block: 'center' }
    }
  });

  tour.addSteps([
    {
      id: 'welcome',
      title: 'Welcome to X.IDE! 👋',
      text: `You're 3 clicks away from publishing your first page. Let's get started!`,
      buttons: [
        {
          text: 'Start Tour',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ]
    },
    {
      id: 'canvas',
      title: 'Your Canvas',
      text: 'This is where your page comes to life. We\'ve pre-filled it with a template to get you started.',
      attachTo: {
        element: '.canvas-container',
        on: 'right'
      },
      buttons: [
        { text: 'Back', action: tour.back },
        { text: 'Next', action: tour.next, classes: 'shepherd-button-primary' }
      ]
    },
    {
      id: 'edit-text',
      title: 'Edit Content',
      text: 'Click on any text to edit it. Try clicking this headline!',
      attachTo: {
        element: '[data-element-type="hero"] h1',
        on: 'bottom'
      },
      advanceOn: {
        selector: '[data-element-type="hero"] h1',
        event: 'click'
      },
      buttons: [
        { text: 'Back', action: tour.back },
        { text: 'Next', action: tour.next, classes: 'shepherd-button-primary' }
      ]
    },
    {
      id: 'properties-panel',
      title: 'Customize Everything',
      text: 'Change colors, fonts, images, and more in this panel.',
      attachTo: {
        element: '.properties-panel',
        on: 'left'
      },
      buttons: [
        { text: 'Back', action: tour.back },
        { text: 'Next', action: tour.next, classes: 'shepherd-button-primary' }
      ]
    },
    {
      id: 'publish',
      title: 'Publish Your Page',
      text: 'When you\'re happy with your page, click here to publish it to the web!',
      attachTo: {
        element: '[data-action="publish"]',
        on: 'bottom'
      },
      buttons: [
        { text: 'Back', action: tour.back },
        { text: 'Finish Tour', action: tour.complete, classes: 'shepherd-button-primary' }
      ]
    }
  ]);

  return { startTour: () => tour.start() };
}

// Trigger tour on first login
useEffect(() => {
  const hasSeenTour = localStorage.getItem('onboarding_completed');
  if (!hasSeenTour) {
    setTimeout(() => {
      startTour();
      localStorage.setItem('onboarding_completed', 'true');
    }, 1000);
  }
}, []);
```

### 6.2 Contextual Help

**Tooltips on Hover:**
```typescript
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function HelpTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Usage
<HelpTooltip content="This will upload your image and automatically optimize it for web">
  <Label>Upload Logo <InfoIcon className="w-4 h-4 inline" /></Label>
</HelpTooltip>
```

**Help Panel:**
```typescript
function HelpPanel() {
  const [query, setQuery] = useState('');
  const articles = [
    { id: 1, title: 'How to publish my page', category: 'Publishing' },
    { id: 2, title: 'Customizing colors', category: 'Design' },
    { id: 3, title: 'Setting up forms', category: 'Forms' },
    { id: 4, title: 'Adding a custom domain', category: 'Domains' },
    { id: 5, title: 'Understanding analytics', category: 'Analytics' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Help & Support</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <Input
            placeholder="Search for help..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Popular Articles</h4>
          {articles
            .filter(a => a.title.toLowerCase().includes(query.toLowerCase()))
            .map(article => (
              <Button
                key={article.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => openArticle(article.id)}
              >
                <FileText className="w-4 h-4 mr-2" />
                {article.title}
              </Button>
            ))}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-2">Video Tutorials</h4>
          <div className="grid grid-cols-2 gap-2">
            <VideoThumbnail
              title="Getting Started"
              duration="3:24"
              thumbnail="/tutorials/getting-started.jpg"
            />
            <VideoThumbnail
              title="Design Tips"
              duration="5:12"
              thumbnail="/tutorials/design-tips.jpg"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Need more help?</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Can't find what you're looking for?
          </p>
          <Button variant="outline" className="w-full">
            Contact Support
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

## 7. Implementation Roadmap (REVISED - Realistic Timeline)

### Phase 0: Pre-Development (2 weeks)
**Goal:** Finalize architecture and design

**Week 1:**
- ✅ Set up Next.js + TypeScript project
- ✅ Configure Supabase (database, auth, storage)
- ✅ Design database schema (review with team)
- ✅ Set up development environment
- ✅ Create architecture decision records (ADRs)

**Week 2:**
- ✅ Design Figma mockups (key screens only)
- ✅ Set up CI/CD pipeline (GitHub Actions + Vercel)
- ✅ Configure ESLint + Prettier + Husky
- ✅ Write database migrations
- ✅ Set up Sentry error monitoring

**Deliverable:** Development environment ready, design approved

---

### Phase 1: Foundation & Authentication (3 weeks)

**Week 3:**
- ✅ Implement Supabase Auth integration
- ✅ Build login/signup pages
- ✅ Google OAuth integration
- ✅ Protected route wrapper
- ✅ Auth state management (Jotai)

**Week 4:**
- ✅ Build landing page (marketing site)
- ✅ Create user profile page
- ✅ Implement user settings
- ✅ Email verification flow
- ✅ Password reset flow

**Week 5:**
- ✅ Write auth tests (unit + integration)
- ✅ Implement rate limiting (login attempts)
- ✅ Add session persistence
- ✅ Security audit (auth flows)

**Deliverable:** Users can sign up, log in, manage profile

---

### Phase 2: Project Management & Dashboard (4 weeks)

**Week 6-7:**
- ✅ Build projects dashboard UI
- ✅ Project list with search/filter/sort
- ✅ Create project modal (template selection)
- ✅ Implement project CRUD operations
- ✅ Project settings page

**Week 8:**
- ✅ Template gallery UI
- ✅ Template preview modal
- ✅ Load 6 industry templates into database
- ✅ Template usage tracking

**Week 9:**
- ✅ Project duplication feature
- ✅ Project deletion with confirmation
- ✅ Bulk actions (delete multiple)
- ✅ Recent projects widget
- ✅ Dashboard analytics (project count, etc.)

**Deliverable:** Users can manage multiple projects, browse templates

---

### Phase 3: Page Builder Core (6 weeks)

**Week 10-11:**
- ✅ Build canvas component with grid
- ✅ Implement virtual rendering (react-virtuoso)
- ✅ Device toggle (Desktop/Tablet/Mobile)
- ✅ Zoom controls
- ✅ Element selection system

**Week 12-13:**
- ✅ Implement @dnd-kit drag-and-drop
- ✅ Component library panel UI
- ✅ Drag from library to canvas
- ✅ Reorder elements on canvas
- ✅ Delete elements

**Week 14-15:**
- ✅ Properties panel shell
- ✅ Dynamic control factory (text, textarea, color, etc.)
- ✅ Real-time canvas updates
- ✅ Optimistic updates (Jotai)
- ✅ Debounced Supabase writes (2 seconds)
- ✅ Auto-save indicator

**Deliverable:** Functional drag-and-drop builder with real-time updates

---

### Phase 4: Component Library (5 weeks)

**Week 16:**
- ✅ Define TypeScript schemas for all 5 components
- ✅ Build Hero component (3 variants)
  - image_left
  - video_bg
  - centered
- ✅ Implement Hero properties panel

**Week 17:**
- ✅ Build Features component (2 variants)
  - grid
  - alternating
- ✅ Build Testimonials component (2 variants)
  - slider (react-slick)
  - grid

**Week 18:**
- ✅ Build FAQ Accordion component
- ✅ Build CTA component (2 variants)
  - centered
  - split

**Week 19:**
- ✅ Build Lead Form component
- ✅ Form builder UI (add/remove fields)
- ✅ Form validation schema
- ✅ Implement reCAPTCHA

**Week 20:**
- ✅ Component preview thumbnails
- ✅ Component search/filter
- ✅ Responsive testing (all components)
- ✅ Cross-browser testing

**Deliverable:** All 5 component types working with full customization

---

### Phase 5: Form Backend & Notifications (2 weeks)

**Week 21:**
- ✅ Build form submission API endpoint
- ✅ Database schema for form_submissions
- ✅ reCAPTCHA verification
- ✅ Form data validation

**Week 22:**
- ✅ Integrate Resend for email notifications
- ✅ Email templates (form submission alert)
- ✅ Webhook support (CRM integration)
- ✅ Form submissions dashboard

**Deliverable:** Forms work end-to-end (submit → email → dashboard)

---

### Phase 5.5: LeanX Payment Integration (2 weeks)

**Overview:**
Enable users to accept payments directly on their landing pages through LeanX payment gateway integration. Each user connects their own LeanX merchant account to process payments from their customers.

**Week 22.5:**
- ✅ Database schema for transactions table
- ✅ LeanX API credentials in user profiles
- ✅ Payment Button element in page builder
- ✅ Payment button property editor (product, pricing, styling)
- ✅ Bump offer/upsell configuration

**Week 23:**
- ✅ LeanX Checkout Modal component
- ✅ Bump Offer Modal component
- ✅ Payment processing API endpoints
  - `/api/payments/create` - Initialize transaction
  - `/api/payments/process` - Process payment
  - `/api/payments/webhook` - Handle LeanX callbacks
- ✅ LeanX helper library (lib/leanx.ts)
- ✅ Webhook signature validation

**Week 23.5:**
- ✅ Payment settings page (Dashboard → Settings → Payments)
- ✅ LeanX credentials management (API key, Secret key, Merchant ID)
- ✅ Transaction dashboard page
- ✅ Transaction statistics (daily, weekly, monthly)
- ✅ Transaction history table with filtering
- ✅ CSV export functionality

**Key Features:**
1. **Payment Button Element**
   - Customizable product name, description, price
   - Multiple currencies (MYR, USD, SGD)
   - Button styling (color, size, text)
   - Bump offer/upsell with discount pricing

2. **Checkout Flow**
   - LeanX-powered secure checkout modal
   - Card number, expiry, CVV fields
   - Optional shipping & insurance add-on
   - Customer email capture
   - Form validation

3. **Bump Offer System**
   - One-time upsell opportunity
   - Discount percentage configuration
   - Acceptance tracking
   - Added to total transaction amount

4. **Transaction Management**
   - Real-time transaction status tracking
   - Stats cards (today's revenue, successful/failed transactions)
   - Transaction history table
   - Status badges (completed, pending, failed, refunded)
   - CSV export with all transaction details

5. **Security & Compliance**
   - User credentials stored encrypted in database
   - Each user has their own LeanX merchant account
   - Webhook signature validation
   - Row-Level Security policies
   - Secure API key management

**Technical Implementation:**
```typescript
// Transaction Database Schema
{
  user_id: UUID,
  project_id: UUID,
  transaction_id: String,  // LeanX transaction ID
  order_id: String,        // Internal order ID
  product_name: String,
  amount: Decimal,
  currency: String,
  has_bump_offer: Boolean,
  bump_offer_name: String,
  bump_offer_amount: Decimal,
  bump_offer_accepted: Boolean,
  total_amount: Decimal,
  customer_email: String,
  customer_name: String,
  status: Enum(pending, processing, completed, failed, cancelled, refunded),
  leanx_response: JSONB,
  created_at: Timestamp,
  completed_at: Timestamp
}
```

**User Flow:**
1. **Setup:** User enters LeanX credentials in Settings → Payments
2. **Build:** User adds Payment Button element to page in builder
3. **Configure:** User customizes product details, pricing, bump offer
4. **Publish:** Page published with functional payment button
5. **Customer:** Visitor clicks "Pay Now" → Checkout modal appears
6. **Payment:** Customer enters card details → Optional bump offer shown
7. **Complete:** Payment processed via LeanX → Transaction recorded
8. **Dashboard:** User views transaction in Transaction Dashboard
9. **Export:** User can export all transactions to CSV

**Files Created:**
- `supabase/migrations/20260106130000_add_leanx_integration.sql`
- `types/index.ts` (Transaction types)
- `lib/leanx.ts` (LeanX API helper)
- `components/builder/elements/PaymentButton.tsx`
- `components/payment/CheckoutModal.tsx`
- `components/payment/BumpOfferModal.tsx`
- `app/api/payments/create/route.ts`
- `app/api/payments/process/route.ts`
- `app/api/payments/webhook/route.ts`
- `app/api/transactions/export/route.ts`
- `app/dashboard/settings/payments/page.tsx`
- `app/dashboard/transactions/page.tsx`

**Environment Variables:**
```bash
# LeanX credentials are stored per-user in database
# These are for webhook endpoints only:
LEANX_WEBHOOK_SECRET=whsec_xxx
```

**Benefits:**
- Users can monetize their landing pages immediately
- No revenue sharing - users keep 100% (minus LeanX fees)
- Professional checkout experience
- Built-in upsell/bump offer system
- Transaction tracking and analytics
- CSV export for accounting

**Deliverable:** Complete payment processing system with LeanX integration, allowing users to accept payments from their customers through their landing pages.

---

### Phase 6: Analytics System (3 weeks)

**Week 23:**
- ✅ Build analytics tracking script
- ✅ Embed script in published pages
- ✅ Track page views, button clicks, form submits
- ✅ Session tracking
- ✅ Device detection

**Week 24:**
- ✅ Build analytics API endpoints
- ✅ Write SQL queries (aggregations)
- ✅ Implement caching (Redis)
- ✅ Analytics dashboard UI

**Week 25:**
- ✅ Charts (Recharts): Traffic over time, device breakdown
- ✅ Conversion funnel visualization
- ✅ Traffic sources table
- ✅ Export analytics as CSV

**Deliverable:** Real analytics tracking and dashboard

---

### Phase 7: Publishing System (4 weeks)

**Week 26-27:**
- ✅ Build static site generator
- ✅ Render React components to HTML
- ✅ Extract critical CSS
- ✅ Bundle minimal JS runtime
- ✅ Upload to Cloudflare R2

**Week 28:**
- ✅ Custom domain support
- ✅ DNS verification
- ✅ SSL certificate provisioning (Vercel API)
- ✅ Domain management UI

**Week 29:**
- ✅ SEO settings panel
- ✅ Open Graph meta tags
- ✅ Structured data (JSON-LD)
- ✅ Google/Social preview

**Deliverable:** Users can publish pages to CDN with custom domains

---

### Phase 8: Image Optimization (2 weeks)

**Week 30:**
- ✅ Client-side image compression
- ✅ Upload to Supabase Storage
- ✅ Build Edge Function for optimization
- ✅ Generate WebP and AVIF versions

**Week 31:**
- ✅ Generate responsive sizes (sm, md, lg)
- ✅ Generate blurhash placeholders
- ✅ Build OptimizedImage component
- ✅ Test on slow connections

**Deliverable:** All images optimized automatically

---

### Phase 9: Version History & Undo/Redo (3 weeks)

**Week 32:**
- ✅ Implement command pattern
- ✅ Build CommandManager
- ✅ Keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)
- ✅ Undo/redo UI indicators

**Week 33:**
- ✅ Delta-based version system
- ✅ Auto-save every 15 minutes (if changes)
- ✅ Full snapshot every 50 deltas
- ✅ Database migrations for versions table

**Week 34:**
- ✅ Version history UI
- ✅ Preview previous versions
- ✅ Restore functionality
- ✅ Manual snapshot creation

**Deliverable:** Users can undo/redo and restore previous versions

---

### Phase 10: Polish & UX Improvements (3 weeks)

**Week 35:**
- ✅ Implement onboarding tour (Shepherd.js)
- ✅ Contextual tooltips
- ✅ Help panel with articles
- ✅ Video tutorials

**Week 36:**
- ✅ Loading skeletons (all pages)
- ✅ Error boundaries
- ✅ Toast notifications (success/error)
- ✅ Empty states

**Week 37:**
- ✅ Keyboard shortcuts panel
- ✅ Accessibility audit (WCAG AA)
- ✅ Mobile responsiveness (all screens)
- ✅ Dark mode support

**Deliverable:** Polished UX with great onboarding

---

### Phase 11: Performance Optimization (2 weeks)

**Week 38:**
- ✅ Code splitting (route-based + dynamic imports)
- ✅ Lazy loading (components, images)
- ✅ Bundle size optimization (< 200KB initial)
- ✅ Lighthouse audit (target 90+ score)

**Week 39:**
- ✅ Database query optimization (indexes)
- ✅ Redis caching implementation
- ✅ CDN configuration (cache headers)
- ✅ Performance monitoring (Vercel Analytics)

**Deliverable:** Fast, optimized app (< 2.5s LCP)

---

### Phase 12: Testing & QA (3 weeks)

**Week 40:**
- ✅ Write unit tests (Jest + RTL)
  - Component tests
  - Utility function tests
  - Hook tests

**Week 41:**
- ✅ Write integration tests
  - API endpoint tests
  - Database query tests
  - Auth flow tests

**Week 42:**
- ✅ E2E tests (Playwright)
  - Critical paths: Sign up → Create project → Publish
- ✅ Cross-browser testing (Chrome, Safari, Firefox)
- ✅ Mobile device testing (iOS, Android)
- ✅ Security audit (pen testing)
- ✅ Bug fixing

**Deliverable:** 80% test coverage, all critical paths tested

---

### Phase 13: Deployment & Launch (2 weeks)

**Week 43:**
- ✅ Set up production Vercel project
- ✅ Configure environment variables
- ✅ Set up Supabase production instance
- ✅ Configure RLS policies (production)
- ✅ Set up custom domain

**Week 44:**
- ✅ Soft launch to 50 beta users
- ✅ Gather feedback
- ✅ Fix critical bugs
- ✅ Create user documentation
- ✅ PUBLIC LAUNCH 🚀

**Deliverable:** Live production app with paying customers

---

### TOTAL TIMELINE: 44 weeks (~11 months)

**MVP Launch:** After 29 weeks (7 months)
- Core builder + templates + forms + analytics + publishing

**Full V1 Launch:** After 44 weeks (11 months)
- All features including version history, optimizations

---

## 8. Pricing Strategy

### 8.1 Pricing Tiers (SIMPLIFIED 2-TIER MODEL)

| Plan | Price | Target User | Features |
|------|-------|-------------|----------|
| **Free** | $0/month | Hobbyists, Testing | 3 projects, subdomain publishing (`username.yourapp.com`), basic analytics, community support |
| **Pro** | $29/month | SMEs, Freelancers, Agencies | Unlimited projects, subdomain + custom domains, advanced analytics, forms, priority support, white-label |

**Pricing Philosophy:**
- **Free Tier:** Generous limits to let users test and build, with subdomain URLs for professional-looking published pages
- **Pro Tier:** All features unlocked, unlimited projects, custom domain support for full brand control, advanced features

### 8.2 Feature Matrix

| Feature | Free | Pro |
|---------|------|-----|
| **Projects** | 3 | Unlimited |
| **Published Pages** | 3 | Unlimited |
| **Publishing URLs** | **Subdomain** (`username.yourapp.com`) | **Subdomain** (`username.yourapp.com`) + **Custom Domain** (`www.yourdomain.com`) |
| **Templates** | 6 | All templates |
| **Elements per Page** | 10 | Unlimited |
| **Custom Domains** | ❌ | ✅ (Unlimited) |
| **Analytics** | Basic (page views only) | Advanced (full funnel, conversions, heatmaps) |
| **Form Submissions/month** | 50 | Unlimited |
| **Storage** | 100MB | 10GB |
| **Version History** | 7 days | Unlimited |
| **Support** | Community | Priority Email + Chat |
| **White-label** | ❌ | ✅ (Remove "Powered by X.IDE") |
| **Team Collaboration** | ❌ | ✅ (10 seats) |
| **A/B Testing** | ❌ | ✅ |
| **Meta Pixel & GA Integration** | ❌ | ✅ |
| **Export HTML** | ❌ | ✅ |

**Key Differentiator:** Both tiers include **professional subdomain hosting** (`username.yourapp.com`). The Pro tier adds **custom domain support** (`www.yourdomain.com`) for complete branding control, unlimited projects, and advanced features.

### 8.3 Revenue Projections (Conservative - 2-Tier Model)

**Year 1:**
- Total Users: 5,000
- Conversion Rate: 18% (higher due to clearer value prop)
- Paying Users (Pro): 900
- Pro Plan ARPU: $29/month
- **MRR: $26,100**
- **ARR: $313,200**

**Year 2:**
- Total Users: 25,000
- Conversion Rate: 22%
- Paying Users (Pro): 5,500
- Pro Plan ARPU: $29/month
- **MRR: $159,500**
- **ARR: $1,914,000**

**Year 3:**
- Total Users: 100,000
- Conversion Rate: 25%
- Paying Users (Pro): 25,000
- Pro Plan ARPU: $29/month
- **MRR: $725,000**
- **ARR: $8,700,000**

**Rationale for higher conversion:**
- Simpler pricing = less decision fatigue
- Clear Free → Pro upgrade path
- Subdomain feature is a strong incentive
- $29/month is affordable for SMEs

### 8.4 Cost Structure (Year 2 - 25,000 users, 20% paid)

| Cost Item | Monthly Cost | Annual Cost |
|-----------|--------------|-------------|
| Supabase | $2,500 | $30,000 |
| Vercel Pro | $500 | $6,000 |
| Cloudflare R2 | $300 | $3,600 |
| Upstash Redis | $200 | $2,400 |
| Resend Emails | $100 | $1,200 |
| Sentry | $100 | $1,200 |
| Domain & SSL | $50 | $600 |
| **Total Infrastructure** | **$3,750** | **$45,000** |
| Marketing | $20,000 | $240,000 |
| Team (3 devs + 1 designer) | $40,000 | $480,000 |
| **Total Costs** | **$63,750** | **$765,000** |
| | | |
| **Revenue** | **$160,000** | **$1,920,000** |
| **Gross Margin** | **60%** | **60%** |

---

## 9. Success Metrics & KPIs

### 9.1 Product Metrics

| Metric | Target (6 months) | Measurement |
|--------|-------------------|-------------|
| Active Users | 2,500+ | Supabase Analytics |
| Projects Created | 5,000+ | Database count |
| Published Pages | 1,000+ | Database count |
| Template Usage Rate | 70%+ | Event tracking |
| Avg. Time to First Publish | < 15 min | Analytics |
| User Retention (D7) | 40%+ | Cohort analysis |
| User Retention (D30) | 25%+ | Cohort analysis |
| Free → Paid Conversion | 15%+ | Billing analytics |
| Churn Rate | < 5%/month | Billing analytics |

### 9.2 Technical Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Uptime | 99.9%+ | Vercel |
| API Response Time (P95) | < 300ms | Sentry |
| Canvas Render Time | < 100ms | Custom |
| Template Load Time | < 500ms | Custom |
| Lighthouse Performance Score | 90+ | Lighthouse CI |
| First Contentful Paint (FCP) | < 1.0s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Error Rate | < 1% | Sentry |

### 9.3 Business Metrics

| Metric | Target (Year 1) | Measurement |
|--------|-----------------|-------------|
| Monthly Recurring Revenue (MRR) | $21,000 | Stripe |
| Customer Acquisition Cost (CAC) | < $50 | Marketing spend / new customers |
| Lifetime Value (LTV) | > $300 | Avg. subscription length × ARPU |
| LTV:CAC Ratio | > 6:1 | LTV / CAC |
| Payback Period | < 6 months | CAC / (ARPU - COGS) |

---

## 10. Risk Mitigation

### 10.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase quota exceeded | Medium | High | Monitor usage, implement caching, upgrade plan proactively |
| Performance degradation | Medium | High | Virtual rendering, lazy loading, code splitting |
| Security breach | Low | Critical | Regular audits, penetration testing, bug bounty program |
| Data loss | Low | Critical | Automated backups (daily), point-in-time recovery, version history |
| Third-party API downtime | Low | Medium | Graceful degradation, retry logic, status page |

### 10.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low user adoption | Medium | High | Beta testing, user feedback loops, referral program |
| Competitor launches similar product | Medium | Medium | Focus on superior UX, faster iteration, customer support |
| Feature scope creep | High | Medium | Strict phase management, MVP-first approach |
| Team burnout | Medium | High | Realistic timeline, no death marches, hire help if needed |

---

## 11. Post-MVP Roadmap (Phase 2)

### Phase 2 Features (Months 12-18)

#### A. Sales Funnel System
- Checkout modal with payment processing (LeanX)
- Upsell flow
- Order bump feature
- Thank you page
- Funnel analytics

#### B. Inventory Management
- Product catalog
- Stock tracking
- Low stock alerts
- Product variants
- Bulk import/export

#### C. Advanced Components
- Pricing tables (3-tier)
- Multi-step forms
- Video sections
- Countdown timers
- Progress bars

#### D. A/B Testing
- Create variations
- Traffic splitting
- Conversion tracking
- Statistical significance
- Winner auto-selection

#### E. Team Collaboration
- Invite team members
- Role-based permissions
- Real-time collaborative editing
- Comments & annotations
- Activity log

#### F. Integrations
- Zapier integration
- Mailchimp / ConvertKit
- HubSpot CRM
- Stripe Billing
- WordPress plugin export

---

## 12. Appendix

### 12.1 Technology Decisions (ADRs)

#### ADR-001: Why Supabase over Firebase?
- **Decision:** Use Supabase (PostgreSQL) instead of Firebase
- **Rationale:**
  - No 1MB document size limit
  - More powerful queries (SQL)
  - Lower cost at scale (98% savings)
  - Relational data model fits better
  - Better for analytics (aggregations)
- **Trade-offs:**
  - Steeper learning curve (SQL vs. NoSQL)
  - Smaller community (vs. Firebase)

#### ADR-002: Why Jotai over Zustand?
- **Decision:** Use Jotai for state management
- **Rationale:**
  - Atomic state (better for complex forms)
  - Better TypeScript support
  - Smaller bundle size
  - Integrates well with React Suspense
- **Trade-offs:**
  - Newer library (less mature)
  - Smaller ecosystem

#### ADR-003: Why @dnd-kit over React DnD?
- **Decision:** Use @dnd-kit for drag-and-drop
- **Rationale:**
  - Modern, actively maintained
  - Better performance (50+ items)
  - Touch device support
  - Accessibility built-in
- **Trade-offs:**
  - Different API than React DnD

### 12.2 Database Migrations

```sql
-- Migration 001: Initial schema
-- Run with: supabase db reset

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'starter', 'pro', 'agency')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  element_count INT DEFAULT 0,
  current_version INT DEFAULT 0,
  published_url TEXT,
  seo_settings JSONB DEFAULT '{}',
  integrations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Elements
CREATE TABLE elements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  "order" INT NOT NULL,
  props JSONB NOT NULL DEFAULT '{}',
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_elements_project_order ON elements(project_id, "order");

-- Project versions
CREATE TABLE project_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  version_number INT NOT NULL,
  snapshot_type TEXT DEFAULT 'delta' CHECK (snapshot_type IN ('full', 'delta')),
  data JSONB NOT NULL,
  base_version INT,
  created_by UUID REFERENCES profiles(id),
  is_auto_save BOOLEAN DEFAULT true,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_versions_project ON project_versions(project_id, version_number DESC);

-- Templates
CREATE TABLE templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT true,
  usage_count INT DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON templates(category) WHERE is_public = true;
CREATE INDEX idx_templates_tags ON templates USING GIN(tags);

-- Form submissions
CREATE TABLE form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  form_id TEXT NOT NULL,
  data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_project ON form_submissions(project_id, submitted_at DESC);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  device_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_project_date ON analytics_events(project_id, created_at DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

-- Custom domains
CREATE TABLE custom_domains (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT false,
  ssl_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can CRUD own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- Elements policies (inherit from projects)
CREATE POLICY "Users can CRUD elements in own projects" ON elements FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = elements.project_id AND projects.user_id = auth.uid()
  ));

-- Templates policies (public read)
CREATE POLICY "Anyone can read public templates" ON templates FOR SELECT USING (is_public = true);

-- Form submissions policies
CREATE POLICY "Users can read form submissions for own projects" ON form_submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = form_submissions.project_id AND projects.user_id = auth.uid()
  ));

-- Analytics policies
CREATE POLICY "Users can read analytics for own projects" ON analytics_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = analytics_events.project_id AND projects.user_id = auth.uid()
  ));

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_elements_updated_at BEFORE UPDATE ON elements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 12.3 Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Cloudflare R2
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=published-pages

# Resend (Email)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourapp.com

# Sentry (Error Monitoring)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your-auth-token

# LeanX Payment Gateway (Server-side only)
LEANX_SECRET_KEY=sk_test_xxx
LEANX_WEBHOOK_SECRET=whsec_xxx

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le-xxx
RECAPTCHA_SECRET_KEY=6Le-xxx  # Server-side only

# Vercel (for custom domains)
VERCEL_API_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=prj_xxx

# Cloudflare (for CDN purge)
CLOUDFLARE_API_TOKEN=your-cf-token
CLOUDFLARE_ZONE_ID=your-zone-id

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourapp.com  # Optional: Plausible Analytics
```

---

## 13. Conclusion

This revised PRD addresses all critical technical issues identified in the CTO assessment:

### ✅ Fixed Issues:
1. **Supabase replaces Firebase** → No more document limits, 98% cost savings
2. **Delta-based version history** → 92% storage savings
3. **Virtual canvas rendering** → 5x performance improvement
4. **Server-side payment processing** → Secure API key management
5. **Real analytics from day 1** → Core value prop delivered
6. **Template-first UX** → Better for non-technical users
7. **Realistic 44-week timeline** → Achievable with quality
8. **Form backend included** → Lead forms actually work
9. **Image optimization** → Fast page loads
10. **Comprehensive onboarding** → Users succeed quickly

### 📊 Expected Outcomes:
- **Cost at 100K users:** $4,500/month (vs. $344,600 with Firebase)
- **Performance:** < 100ms canvas render, < 500ms template load
- **User Experience:** 10-minute page creation (vs. 2 hours competitors)
- **Revenue:** $21K MRR in Year 1, $160K MRR in Year 2
- **Gross Margin:** 60%+ (sustainable business)

### 🚀 Ready for Development:
This PRD is **approved for implementation**. All architectural decisions have been validated, risks mitigated, and timeline adjusted for reality.

**Next Steps:**
1. Kickoff Phase 0 (Architecture setup) - Week of Jan 6, 2026
2. Daily standups during development
3. Bi-weekly demo to stakeholders
4. MVP launch target: Week 29 (August 2026)
5. Full V1 launch target: Week 44 (November 2026)

---

**Document Approval:**

- [x] Product Owner - Approved
- [x] Technical Lead (CTO Assessment) - Approved
- [ ] Design Lead - Pending review
- [ ] Stakeholders - Pending review

---

*End of Revised PRD - Version 2.0*
