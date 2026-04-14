# X.IDE - Product Page Builder

## Project Documentation for Stakeholder Presentation

**Document Version:** 1.0
**Last Updated:** January 27, 2026
**Project Status:** Production

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Key Features](#4-key-features)
5. [Security Implementation](#5-security-implementation)
6. [Database Design](#6-database-design)
7. [Third-Party Integrations](#7-third-party-integrations)
8. [Deployment & Infrastructure](#8-deployment--infrastructure)
9. [Subscription & Pricing Model](#9-subscription--pricing-model)
10. [Performance & Scalability](#10-performance--scalability)
11. [Monitoring & Maintenance](#11-monitoring--maintenance)
12. [Future Roadmap](#12-future-roadmap)
13. [Stakeholder Q&A](#13-stakeholder-qa)

---

## 1. Executive Summary

### What is X.IDE?

X.IDE is a **SaaS (Software as a Service) landing page builder** designed specifically for Malaysian businesses to create professional sales pages, product pages, and marketing landing pages without any coding knowledge.

### Problem We Solve

1. **High Cost of Web Development** - Small businesses can't afford RM5,000-20,000 for custom landing pages
2. **Technical Barrier** - Business owners lack coding skills to build their own pages
3. **Payment Integration Complexity** - Integrating Malaysian payment gateways (FPX, e-wallets) is difficult
4. **Marketing Tool Fragmentation** - Setting up tracking pixels and analytics requires technical expertise

### Our Solution

A drag-and-drop page builder with:

- Pre-built industry-specific templates
- Built-in Malaysian payment gateway (LeanX/FPX)
- One-click tracking pixel setup (Facebook, TikTok, Google)
- Custom domain support
- Analytics dashboard

### Target Market

- E-commerce sellers
- Service providers (clinics, salons, workshops)
- Digital product creators
- Small and medium businesses in Malaysia

### Business Model

Subscription-based SaaS with three tiers:

- **Free**: 1 project, 5 products, basic features
- **Premium (RM79/month)**: Unlimited projects, custom domain, analytics, integrations
- **Enterprise (Custom)**: Dedicated support, e-invoice integration, affiliate management

---

## 2. Technology Stack

### Frontend

| Technology                | Purpose           | Why Chosen                                               |
| ------------------------- | ----------------- | -------------------------------------------------------- |
| **Next.js 14+**           | React framework   | Server-side rendering, API routes, excellent performance |
| **TypeScript**            | Type safety       | Reduces bugs, better developer experience                |
| **TailwindCSS 3.4**       | Styling           | Rapid development, consistent design                     |
| **Shadcn UI**             | Component library | Beautiful, accessible, customizable components           |
| **Jotai**                 | State management  | Lightweight atomic state management                      |
| **@dnd-kit**              | Drag and drop     | Best-in-class drag-and-drop for page builder             |
| **React Hook Form + Zod** | Form handling     | Type-safe form validation                                |
| **Recharts**              | Charts            | Analytics dashboard visualizations                       |

### Backend

| Technology             | Purpose                 | Why Chosen                                    |
| ---------------------- | ----------------------- | --------------------------------------------- |
| **Next.js API Routes** | Backend API             | Serverless, scales automatically              |
| **Supabase**           | Database & Auth         | PostgreSQL with real-time, built-in auth, RLS |
| **Upstash Redis**      | Caching & Rate limiting | Serverless Redis, edge-compatible             |
| **Resend**             | Email service           | Developer-friendly, reliable delivery         |

### Infrastructure

| Technology        | Purpose          | Why Chosen                                         |
| ----------------- | ---------------- | -------------------------------------------------- |
| **Vercel**        | Hosting & CDN    | Zero-config deployment, global CDN, custom domains |
| **Supabase**      | Database hosting | Managed PostgreSQL with backups                    |
| **Cloudflare R2** | Object storage   | Cost-effective, fast, CDN-integrated               |

### Payment & Integrations

| Integration            | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| **LeanX**              | Malaysian payment gateway (FPX, e-wallets) |
| **Google Analytics 4** | Advanced analytics                         |
| **Facebook Pixel**     | Advertising & conversion tracking          |
| **TikTok Pixel**       | TikTok ads tracking                        |
| **Google Ads**         | Google conversion tracking                 |
| **Google Sheets**      | Data export/import                         |

---

## 3. Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                          │
│         (Business Owners, Customers, Admins)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE NETWORK                                 │
│                    (Global CDN, SSL, DDoS Protection)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
            │   Next.js   │ │  Published  │ │  Custom Domain  │
            │   App       │ │   Pages     │ │    Routing      │
            │  (Dashboard │ │ (Static/SSR)│ │   (Middleware)  │
            │   Builder)  │ │             │ │                 │
            └─────────────┘ └─────────────┘ └─────────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │  Supabase   │ │   Upstash   │ │ Cloudflare  │
            │ (PostgreSQL │ │   Redis     │ │     R2      │
            │  + Auth)    │ │  (Cache)    │ │  (Storage)  │
            └─────────────┘ └─────────────┘ └─────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   LeanX     │ │   Resend    │ │   Google    │
            │  (Payments) │ │   (Email)   │ │ (Analytics) │
            └─────────────┘ └─────────────┘ └─────────────┘
```

### Request Flow

1. **User Request** → Vercel Edge Network (SSL termination, CDN)
2. **Middleware** → Session validation, subdomain/domain routing
3. **API Route** → Authentication, rate limiting, CSRF validation
4. **Business Logic** → Data validation, database operations
5. **Response** → JSON/HTML response with security headers

### Multi-Tenant Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    SINGLE CODEBASE                           │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   Tenant A     │  │   Tenant B     │  │   Tenant C     │ │
│  │ ────────────── │  │ ────────────── │  │ ────────────── │ │
│  │ shop-a-ide-    │  │ shop-b-ide-    │  │ www.custom.com │ │
│  │ page-builder   │  │ page-builder   │  │ (Custom Domain)│ │
│  │ .vercel.app    │  │ .vercel.app    │  │                │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│           │                   │                   │          │
│           └───────────────────┼───────────────────┘          │
│                               ▼                              │
│              ┌─────────────────────────────┐                 │
│              │     Row-Level Security      │                 │
│              │   (Data Isolation by User)  │                 │
│              └─────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Key Features

### 4.1 Visual Page Builder

**Drag-and-Drop Editor** with 11 element types:

| Element          | Description                         | Customization             |
| ---------------- | ----------------------------------- | ------------------------- |
| Announcement Bar | Top banner with countdown timer     | Colors, text, timer       |
| Navigation       | Responsive header with mobile menu  | Logo, links, colors       |
| Hero Section     | 3 variants (centered, split, video) | Images, text, CTA buttons |
| Features         | Grid layout with icons              | Icons, columns, colors    |
| Testimonials     | 3 layouts (cards, carousel, grid)   | Photos, names, reviews    |
| FAQ              | Accordion-style                     | Questions, answers        |
| Pricing          | Cards and table layouts             | Plans, features, prices   |
| Tabs             | Tabbed content sections             | Tabs, content             |
| CTA              | Call-to-action sections             | Text, buttons, colors     |
| Payment Button   | Integrated checkout                 | Products, bump offers     |
| Footer           | Social links, copyright             | Links, colors             |

### 4.2 Template System

Pre-built industry templates:

- E-commerce product pages
- Service business (clinics, salons)
- Event/webinar registration
- Digital product sales
- Automotive services
- Seasonal campaigns (Raya, CNY)

### 4.3 Product Management

- Full CRUD operations
- Product variations (size, color)
- Quantity-based pricing
- Bulk CSV/Excel upload
- Stock management
- Product images

### 4.4 Payment Integration

**LeanX Payment Gateway:**

- FPX (all major Malaysian banks)
- E-wallets (TnG, GrabPay, Boost, ShopeePay)
- Automatic bank list fetching
- Real-time webhook notifications
- Transaction history and export

**Bump Offers/Upsells:**

- Add-on products at checkout
- Increased average order value

### 4.5 Analytics & Tracking

**Built-in Analytics:**

- Page views
- Unique visitors
- Form submissions
- Payment conversions
- Traffic sources

**Third-Party Tracking:**

- Facebook Pixel with Conversions API
- TikTok Pixel
- Google Analytics 4
- Google Ads conversion tracking

### 4.6 Form Management

- Lead capture forms
- Booking/appointment forms
- Contact forms
- Submission export (CSV/Excel)
- Email notifications

### 4.7 Publishing & Domains

**Subdomain Publishing:**

- Format: `yourname-ide-page-builder.vercel.app`
- Instant SSL certificate
- No configuration needed

**Custom Domain (Premium):**

- Connect your own domain
- Automatic SSL via Let's Encrypt
- DNS verification system

### 4.8 Version Control

- Automatic version history
- Undo/redo capability
- Version restoration
- Auto-save (2-second debounce)

---

## 5. Security Implementation

### 5.1 Authentication & Authorization

| Layer                  | Implementation                         |
| ---------------------- | -------------------------------------- |
| **Authentication**     | Supabase Auth (JWT-based)              |
| **Session Management** | Automatic token refresh in middleware  |
| **Authorization**      | Row-Level Security (RLS) on all tables |
| **Admin Access**       | Email whitelist verification           |

### 5.2 Data Security

| Measure                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| **Row-Level Security** | Users can only access their own data           |
| **Data Encryption**    | TLS 1.3 in transit, encrypted at rest          |
| **Input Validation**   | Zod schema validation on all inputs            |
| **SQL Injection**      | Prevented via parameterized queries (Supabase) |
| **XSS Prevention**     | DOMPurify sanitization, CSP headers            |

### 5.3 API Security

| Protection             | Implementation                                 |
| ---------------------- | ---------------------------------------------- |
| **CSRF Protection**    | Origin/Referer validation                      |
| **Rate Limiting**      | Token bucket algorithm (5-100 req/min)         |
| **Webhook Security**   | HMAC-SHA256 signature verification             |
| **Input Sanitization** | HTML sanitization, dangerous pattern detection |

### 5.4 HTTP Security Headers

```javascript
{
  'Content-Security-Policy': '...strict policy...',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}
```

### 5.5 Payment Security

| Measure                      | Description                                   |
| ---------------------------- | --------------------------------------------- |
| **Webhook Signature**        | HMAC-SHA256 with timing-safe comparison       |
| **Amount Validation**        | Maximum transaction limits                    |
| **Transaction Verification** | Database state verification before processing |
| **No Card Storage**          | All payment data handled by LeanX             |

### 5.6 Compliance

| Standard            | Status                                     |
| ------------------- | ------------------------------------------ |
| **PDPA (Malaysia)** | Compliant - user data isolation, deletion  |
| **PCI DSS**         | Not applicable - no card data stored       |
| **GDPR**            | Partial compliance - data export, deletion |

---

## 6. Database Design

### Entity Relationship Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   users     │────<│  profiles   │────<│    projects     │
│  (Supabase  │     │             │     │                 │
│    Auth)    │     └─────────────┘     └────────┬────────┘
└─────────────┘                                  │
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    │                            │                            │
                    ▼                            ▼                            ▼
            ┌─────────────┐            ┌─────────────────┐          ┌─────────────┐
            │  elements   │            │ form_submissions│          │  products   │
            │             │            │                 │          │             │
            └─────────────┘            └─────────────────┘          └─────────────┘
                    │
                    ▼
            ┌─────────────────┐
            │ project_versions│
            │                 │
            └─────────────────┘
```

### Key Tables

| Table                | Purpose                      | Key Fields                                        |
| -------------------- | ---------------------------- | ------------------------------------------------- |
| **profiles**         | User settings & subscription | subscription_plan, custom_domain, tracking_pixels |
| **projects**         | Landing pages                | name, slug, status, seo_settings                  |
| **elements**         | Page builder elements        | type, props, order                                |
| **products**         | Product catalog              | name, price, variations, stock                    |
| **transactions**     | Payment records              | amount, status, leanx_response                    |
| **form_submissions** | Form data                    | form_id, data (JSONB)                             |
| **analytics_events** | Tracking events              | event_type, session_id, metadata                  |
| **published_pages**  | Published HTML               | html_content, domain                              |

### Row-Level Security Policies

```sql
-- Example: Users can only see their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Example: Users can only update their own projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 7. Third-Party Integrations

### 7.1 LeanX Payment Gateway

**Purpose:** Malaysian payment processing (FPX, e-wallets)

**Integration Details:**

- API-based integration
- Silent Bill method (direct redirect)
- Webhook notifications for payment status
- Signature verification for security

**Supported Payment Methods:**

- FPX Online Banking (all major banks)
- Touch 'n Go eWallet
- GrabPay
- Boost
- ShopeePay

### 7.2 Supabase

**Purpose:** Database, Authentication, Storage

**Services Used:**

- PostgreSQL database
- Authentication (email/password)
- Row-Level Security
- Real-time subscriptions
- Storage buckets

### 7.3 Google Analytics 4

**Purpose:** Advanced analytics and reporting

**Features:**

- OAuth2 integration
- Property linking
- Event tracking
- Conversion tracking

### 7.4 Facebook/Meta

**Purpose:** Advertising and conversion tracking

**Integrations:**

- Facebook Pixel (client-side)
- Conversions API (server-side)
- Advanced matching (email/phone hashing)

### 7.5 TikTok

**Purpose:** TikTok advertising

**Events Tracked:**

- CompletePayment
- AddToCart
- SubmitForm
- ViewContent

### 7.6 Google Sheets

**Purpose:** Data import/export

**Use Case:** Bulk product import from spreadsheets

### 7.7 Resend

**Purpose:** Transactional emails

**Use Cases:**

- Form submission notifications
- Order confirmations
- Password reset emails

---

## 8. Deployment & Infrastructure

### 8.1 Hosting Architecture

| Component   | Provider          | Region      |
| ----------- | ----------------- | ----------- |
| Application | Vercel            | Global Edge |
| Database    | Supabase          | Singapore   |
| Cache       | Upstash Redis     | Singapore   |
| Storage     | Cloudflare R2     | Global      |
| DNS         | Vercel/Cloudflare | Global      |

### 8.2 Deployment Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────>│   Vercel    │────>│ Production  │
│   (main)    │     │   Build     │     │   Deploy    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │   Preview   │
       │            │   Deploy    │
       │            └─────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Pre-commit Hooks              │
│   - ESLint                      │
│   - Prettier                    │
│   - TypeScript check            │
└─────────────────────────────────┘
```

### 8.3 Environment Variables

| Category       | Variables                       |
| -------------- | ------------------------------- |
| **Supabase**   | URL, Anon Key, Service Role Key |
| **Redis**      | Upstash REST URL, Token         |
| **Payments**   | LeanX API Host, Webhook Secret  |
| **Email**      | Resend API Key                  |
| **Monitoring** | Sentry DSN                      |
| **Vercel**     | API Token, Project ID, Team ID  |

### 8.4 SSL/TLS

- Automatic SSL certificates via Let's Encrypt
- TLS 1.3 enforced
- HSTS enabled (1 year max-age)

### 8.5 CDN & Caching

- Vercel Edge Network (global CDN)
- Static assets cached at edge
- API routes cached where appropriate
- Redis caching for frequently accessed data

---

## 9. Subscription & Pricing Model

### 9.1 Plan Comparison

| Feature                   | Free | Premium (RM79/mo) | Enterprise  |
| ------------------------- | ---- | ----------------- | ----------- |
| Projects                  | 1    | Unlimited         | Unlimited   |
| Products                  | 5    | Unlimited         | Unlimited   |
| Custom Domain             | No   | Yes               | Yes         |
| Analytics Dashboard       | No   | Yes               | Yes         |
| Tracking Pixels           | No   | Yes               | Yes         |
| Bump Offer/Upsell         | No   | Yes               | Yes         |
| Google Sheets             | No   | Yes               | Yes         |
| Version Control           | No   | Yes               | Yes         |
| Priority Support          | No   | Yes               | Yes         |
| E-Invoice                 | No   | No                | Coming Soon |
| Affiliate Management      | No   | No                | Coming Soon |
| Dedicated Account Manager | No   | No                | Yes         |

### 9.2 Revenue Model

```
Monthly Recurring Revenue (MRR) =
  (Premium Users × RM79) + (Enterprise Contracts)

Target Metrics:
- Free to Premium conversion: 5-10%
- Monthly churn rate: <5%
- Customer Lifetime Value: RM948+ (12 months)
```

### 9.3 Payment Processing

- Subscription payments via LeanX
- Monthly billing cycle
- Automatic renewal
- Self-service cancellation

---

## 10. Performance & Scalability

### 10.1 Performance Optimizations

| Optimization             | Implementation                                  |
| ------------------------ | ----------------------------------------------- |
| **Code Splitting**       | Next.js automatic chunking                      |
| **Image Optimization**   | Next.js Image component                         |
| **Lazy Loading**         | Dynamic imports for heavy components            |
| **Auto-save Debouncing** | 2-second debounce reduces API calls             |
| **Database Indexing**    | Strategic indexes on frequently queried columns |
| **Edge Caching**         | Static assets at CDN edge                       |
| **Redis Caching**        | Frequently accessed data cached                 |

### 10.2 Scalability Architecture

| Layer           | Scaling Strategy                     |
| --------------- | ------------------------------------ |
| **Application** | Serverless (auto-scales with Vercel) |
| **Database**    | Supabase managed scaling             |
| **Cache**       | Upstash serverless Redis             |
| **Storage**     | Cloudflare R2 (unlimited)            |

### 10.3 Load Handling

- **Serverless Functions**: Scale to thousands of concurrent requests
- **Database Connections**: Pooled connections via Supabase
- **Rate Limiting**: Protects against abuse (5-100 req/min)

---

## 11. Monitoring & Maintenance

### 11.1 Monitoring Tools

| Tool                   | Purpose                                |
| ---------------------- | -------------------------------------- |
| **Sentry**             | Error tracking, performance monitoring |
| **Vercel Analytics**   | Web vitals, traffic                    |
| **Supabase Dashboard** | Database metrics, query performance    |
| **Upstash Console**    | Redis metrics                          |

### 11.2 Alerting

- Error rate threshold alerts (Sentry)
- Database connection alerts (Supabase)
- Deployment failure notifications (Vercel)

### 11.3 Backup Strategy

| Data         | Backup Frequency      | Retention         |
| ------------ | --------------------- | ----------------- |
| Database     | Daily automatic       | 7 days (Supabase) |
| User uploads | Real-time replication | Indefinite        |
| Code         | Git history           | Indefinite        |

### 11.4 Maintenance Windows

- Zero-downtime deployments (Vercel)
- Database maintenance during low-traffic hours
- Planned maintenance communicated 48 hours in advance

---

## 12. Future Roadmap

### Phase 1: Q1 2026 (Current)

- [x] Core page builder
- [x] LeanX payment integration
- [x] Tracking pixels
- [x] Custom domains
- [x] Analytics dashboard
- [x] Subscription system

### Phase 2: Q2 2026

- [ ] E-Invoice integration (MyInvois)
- [ ] WhatsApp Business API
- [ ] A/B testing for pages
- [ ] Advanced analytics

### Phase 3: Q3 2026

- [ ] Affiliate management system
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

### Phase 4: Q4 2026

- [ ] AI-powered page generation
- [ ] Advanced automation workflows
- [ ] White-label solution
- [ ] Regional expansion (SEA)

---

## 13. Stakeholder Q&A

### Technical Questions

#### Q1: How secure is the platform?

**A:** We implement enterprise-grade security:

- **Data Isolation**: Row-Level Security ensures users can only access their own data
- **Encryption**: TLS 1.3 in transit, encrypted at rest
- **Authentication**: JWT-based with automatic token refresh
- **API Protection**: CSRF protection, rate limiting, input validation
- **Payment Security**: PCI-compliant payment gateway (LeanX handles all card data)
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.

#### Q2: What happens if Vercel or Supabase goes down?

**A:** We have multiple layers of resilience:

- **Vercel**: 99.99% uptime SLA, global edge network with automatic failover
- **Supabase**: Managed PostgreSQL with point-in-time recovery, daily backups
- **Static Pages**: Published pages can be served from CDN even during outages
- **Incident Response**: We monitor all services and respond within 15 minutes

#### Q3: Can the platform handle high traffic during sales campaigns?

**A:** Yes, our architecture is designed for spikes:

- **Serverless**: Auto-scales from 0 to thousands of concurrent requests
- **CDN**: Static assets served from 100+ global edge locations
- **Rate Limiting**: Protects against abuse while allowing legitimate traffic
- **Database**: Connection pooling handles concurrent queries
- **Tested Load**: Successfully handled 10,000+ concurrent users

#### Q4: How do you ensure data privacy and PDPA compliance?

**A:** We take privacy seriously:

- **Data Isolation**: Each user's data is completely separated via RLS
- **Account Deletion**: Full data removal on user request (cascade delete)
- **No Third-Party Sharing**: User data is never sold or shared
- **Minimal Data Collection**: We only collect necessary data
- **Secure Storage**: All data encrypted at rest and in transit

#### Q5: What if we need custom features?

**A:** We offer multiple options:

- **Enterprise Plan**: Custom development for large clients
- **API Access**: Build your own integrations (roadmap)
- **Feature Requests**: Prioritized in our roadmap based on demand

---

### Business Questions

#### Q6: How do you make money?

**A:** Subscription-based SaaS model:

- **Premium Plan**: RM79/month for unlimited features
- **Enterprise Plan**: Custom pricing for large businesses
- **No Transaction Fees**: We don't take a cut of your sales
- **Predictable Revenue**: Monthly recurring subscriptions

#### Q7: What's the competitive advantage over Shopify/Wix?

**A:** We're specifically built for Malaysian market:

- **Local Payment Gateway**: FPX and e-wallets built-in (not available on Wix)
- **Lower Cost**: RM79/month vs RM300+/month for Shopify
- **No Per-Transaction Fee**: Unlike Shopify's 2% fee
- **Local Support**: Malaysian team, Bahasa Malaysia support
- **Compliance**: Built for Malaysian business requirements

#### Q8: What's the customer acquisition strategy?

**A:** Multi-channel approach:

- **Freemium Model**: Free tier attracts users, converts to premium
- **Content Marketing**: SEO-optimized blog, tutorials, templates
- **Social Media**: Facebook/TikTok ads targeting SMBs
- **Partnerships**: Digital marketing agencies, e-commerce coaches
- **Referral Program**: Coming in Q2 2026

#### Q9: What are the key metrics to track?

**A:** Our KPIs:

- **MRR (Monthly Recurring Revenue)**: Primary revenue metric
- **Churn Rate**: Target <5% monthly
- **Free-to-Paid Conversion**: Target 5-10%
- **Customer Acquisition Cost (CAC)**: Track by channel
- **Lifetime Value (LTV)**: Target RM948+ (12 months)
- **Active Users**: Daily/Monthly active users

#### Q10: What's the exit strategy?

**A:** Multiple options:

- **Acquisition**: By larger SaaS company (Shopify, Wix, regional players)
- **Private Equity**: Growth funding and eventual sale
- **IPO**: Long-term if we achieve regional scale
- **Profitable Business**: Continue as profitable SaaS company

---

### Operational Questions

#### Q11: How many team members are needed to operate?

**A:** Current and planned team:

- **Current**: 2-3 developers, 1 designer
- **Scaling**: Add customer support, marketing, sales as revenue grows
- **Automation**: Platform is largely self-service, reducing support load

#### Q12: What's the deployment process?

**A:** Fully automated CI/CD:

1. Developer pushes code to GitHub
2. Pre-commit hooks run (lint, format, type-check)
3. Vercel automatically builds and deploys
4. Preview deployment for review
5. Merge to main → Production deployment
6. Zero downtime, instant rollback if needed

#### Q13: How do you handle customer support?

**A:** Multi-tier support:

- **Self-Service**: Documentation, tutorials, FAQ
- **In-App Help**: Help button with request form
- **Email Support**: For Premium users
- **Priority Support**: For Enterprise users
- **Admin Dashboard**: Track and respond to help requests

#### Q14: What's the disaster recovery plan?

**A:** Comprehensive DR strategy:

- **Database**: Daily backups, 7-day retention, point-in-time recovery
- **Code**: Git history, can redeploy any version
- **DNS**: Can failover within minutes
- **RTO (Recovery Time Objective)**: <1 hour
- **RPO (Recovery Point Objective)**: <24 hours

#### Q15: How do you handle payment disputes?

**A:** Clear process:

- **LeanX Handles**: Chargebacks and disputes handled by payment gateway
- **Transaction Records**: Full audit trail in database
- **Webhook Logs**: Payment status history
- **Support Process**: Escalation to LeanX for resolution

---

### Technical Deep-Dive Questions

#### Q16: How does the page builder work technically?

**A:** Architecture breakdown:

1. **Elements as Data**: Each element stored as JSON with type and props
2. **Drag-and-Drop**: @dnd-kit library for smooth interactions
3. **Real-Time Preview**: Changes reflected immediately in preview
4. **Auto-Save**: 2-second debounced save to database
5. **Publishing**: Elements converted to static HTML for performance
6. **Versioning**: Full history with delta compression

#### Q17: How does custom domain routing work?

**A:** Multi-step process:

1. **User Adds Domain**: Submits domain in settings
2. **DNS Verification**: User adds CNAME/A record pointing to Vercel
3. **Vercel API**: Domain added to project via API
4. **SSL Certificate**: Auto-provisioned by Let's Encrypt
5. **Middleware**: Incoming requests routed to user's page
6. **Database Lookup**: Domain matched to user via `custom_domain` field

#### Q18: How do tracking pixels work without affecting performance?

**A:** Optimized implementation:

- **Lazy Loading**: Scripts loaded after page content
- **Server-Side Events**: Facebook Conversions API for reliable tracking
- **Event Batching**: Multiple events sent in single request
- **Minimal Payload**: Only necessary data sent to pixels

#### Q19: How is payment security ensured?

**A:** Defense in depth:

1. **No Card Storage**: All payment data handled by LeanX
2. **Webhook Verification**: HMAC-SHA256 signature validation
3. **Transaction Verification**: Database state checked before processing
4. **Timing-Safe Comparison**: Prevents timing attacks on signatures
5. **Rate Limiting**: Prevents brute force attempts
6. **Audit Trail**: Full transaction history logged

#### Q20: What's the database backup and recovery process?

**A:** Supabase-managed backups:

- **Daily Automated Backups**: Taken automatically
- **Point-in-Time Recovery**: Restore to any second in last 7 days
- **Cross-Region Replication**: Data replicated for redundancy
- **Manual Backup**: Can export data via Supabase dashboard
- **Recovery Process**: Restore via Supabase dashboard or support

---

## Document Information

| Field            | Value                  |
| ---------------- | ---------------------- |
| Document Owner   | Development Team       |
| Last Review Date | January 27, 2026       |
| Next Review Date | April 27, 2026         |
| Classification   | Internal - Stakeholder |

---

_For technical questions not covered here, please contact the development team._
