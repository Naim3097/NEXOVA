# Planned Features & Roadmap
## X.IDE Page Builder - Future Development

**Last Updated:** January 15, 2026
**Status:** Planning Phase
**Current Phase:** Phase 11 Completed

---

## Table of Contents

1. [Phase 12: Lead Generation](#phase-12-lead-generation)
2. [Phase 13: Import/Export System](#phase-13-importexport-system)
3. [Phase 14: WhatsApp Integration](#phase-14-whatsapp-integration)
4. [Phase 15: Advanced Analytics](#phase-15-advanced-analytics)
5. [Technical Considerations](#technical-considerations)
6. [Open Questions](#open-questions)

---

## Phase 12: Lead Generation

### Overview
Add comprehensive lead capture capabilities to sales pages, allowing users to collect customer information with optional payment integration.

### Features

#### 12.1 Simple Lead Form
**Priority:** P0 (Essential)

**User Story:**
> As a sales page creator, I want to add lead capture forms to my pages, so that I can collect customer information (name, email, phone) without requiring payment.

**Use Cases:**
- Newsletter signups
- Free ebook downloads
- Webinar registrations
- General inquiries
- Pre-launch interest collection

**Technical Requirements:**
1. **New Element Type: Lead Form**
   - Configurable fields (name, email, phone, message)
   - Optional/required field settings
   - Custom field labels and placeholders
   - Validation rules per field

2. **Form Submission Handling**
   ```typescript
   // API: POST /api/forms/submit-lead
   {
     project_id: string,
     form_id: string,
     customer_name: string,
     customer_email: string,
     customer_phone?: string,
     message?: string,
     custom_fields?: Record<string, any>,
     metadata: {
       ip_address: string,
       user_agent: string,
       submitted_at: string,
       referrer: string
     }
   }
   ```

3. **Database Schema**
   ```sql
   CREATE TABLE leads (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES profiles(id),
     project_id UUID REFERENCES projects(id),
     form_id TEXT,

     -- Lead information
     customer_name TEXT,
     customer_email TEXT NOT NULL,
     customer_phone TEXT,
     message TEXT,
     custom_fields JSONB,

     -- Metadata
     ip_address INET,
     user_agent TEXT,
     referrer TEXT,

     -- Status tracking
     status TEXT DEFAULT 'new' CHECK (
       status IN ('new', 'contacted', 'qualified', 'converted', 'lost')
     ),

     -- Timestamps
     submitted_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),

     -- Constraints
     UNIQUE(project_id, customer_email)
   );

   CREATE INDEX idx_leads_project_id ON leads(project_id);
   CREATE INDEX idx_leads_user_id ON leads(user_id);
   CREATE INDEX idx_leads_email ON leads(customer_email);
   CREATE INDEX idx_leads_status ON leads(status);
   ```

4. **Form Builder UI**
   - Drag-and-drop field editor
   - Field type selector (text, email, tel, textarea, select, checkbox)
   - Validation rule builder
   - Success message customization
   - Auto-responder email configuration

5. **Lead Management Dashboard**
   - View all leads for a project
   - Filter by status, date range
   - Export to CSV
   - Bulk actions (mark as contacted, qualified, etc.)
   - Email integration for responses

**Success Metrics:**
- Form completion rate
- Lead quality scores
- Conversion from lead to customer
- Email delivery success rate

---

#### 12.2 Lead Form with Payment
**Priority:** P1 (High)

**User Story:**
> As a sales page creator, I want to offer free lead magnets with optional paid upgrades, or paid products with lead capture, so that I can both collect leads and generate revenue.

**Use Cases:**
- Free ebook + paid workbook bundle
- Freemium model (free tier with paid upgrade)
- Tripwire offers (low-cost entry product)
- Upsells after lead capture

**Implementation Options:**

**Option A: Sequential Flow**
```
1. Customer fills lead form (name, email, phone)
2. Submits form → Lead saved to database
3. Shows payment modal (optional or required)
4. If payment completed → Update lead with payment_id
5. If payment skipped → Lead remains without payment
```

**Option B: Integrated Form**
```
1. Single form with both lead fields and payment section
2. Payment section toggle (required/optional)
3. Submit once → Creates lead + payment transaction
4. Links lead to transaction via lead_id
```

**Recommended: Option B (Integrated Form)**

**Technical Requirements:**

1. **Enhanced Lead Schema**
   ```sql
   ALTER TABLE leads ADD COLUMN has_payment BOOLEAN DEFAULT false;
   ALTER TABLE leads ADD COLUMN transaction_id UUID REFERENCES transactions(id);
   ALTER TABLE leads ADD COLUMN lead_value NUMERIC; -- Expected or actual revenue
   ```

2. **Enhanced Transaction Schema**
   ```sql
   ALTER TABLE transactions ADD COLUMN lead_id UUID REFERENCES leads(id);
   ALTER TABLE transactions ADD COLUMN is_lead_upgrade BOOLEAN DEFAULT false;
   ```

3. **Combined Submission Flow**
   ```typescript
   // API: POST /api/forms/submit-lead-with-payment
   interface LeadWithPaymentRequest {
     // Lead data
     customer_name: string;
     customer_email: string;
     customer_phone: string;
     message?: string;

     // Payment data (optional based on configuration)
     payment_required: boolean;
     bank_id?: string;
     product_name?: string;
     amount?: number;

     // Metadata
     project_id: string;
     form_id: string;
   }

   async function handleLeadWithPayment(data: LeadWithPaymentRequest) {
     // 1. Create lead first
     const lead = await createLead({
       customer_name: data.customer_name,
       customer_email: data.customer_email,
       customer_phone: data.customer_phone,
       message: data.message,
       has_payment: data.payment_required,
     });

     // 2. If payment required, create transaction
     if (data.payment_required && data.bank_id) {
       const transaction = await createTransaction({
         lead_id: lead.id,
         customer_email: data.customer_email,
         customer_phone: data.customer_phone,
         amount: data.amount,
         product_name: data.product_name,
       });

       // 3. Create LeanX payment
       const leanxResponse = await createLeanXPayment(transaction);

       // 4. Return payment URL
       return {
         lead_id: lead.id,
         payment_url: leanxResponse.payment_url
       };
     }

     // 5. No payment required, return success
     return {
       lead_id: lead.id,
       success: true
     };
   }
   ```

4. **Form Builder Enhancements**
   - Toggle "Require Payment" option
   - Configure payment amount and product
   - Set up "Free + Paid" bundles
   - Conditional fields (show payment only if interested)

**UI/UX Flow:**

```
┌─────────────────────────────────────┐
│         Lead Capture Form           │
├─────────────────────────────────────┤
│ Name:    [________________]         │
│ Email:   [________________]         │
│ Phone:   [________________]         │
│                                     │
│ ☐ Yes, I want the paid upgrade     │
│   ($49 - Complete Course Bundle)   │
│                                     │
│ [Shows bank selection if checked]  │
│                                     │
│ [Submit / Get Free + Paid]         │
└─────────────────────────────────────┘
```

**Success Metrics:**
- Lead-to-payment conversion rate
- Average revenue per lead
- Free vs paid signup ratio
- Upgrade acceptance rate

---

## Phase 13: Import/Export System

### Overview
Allow users to export their page designs as JSON and import designs from other sources, enabling portability, backups, and template sharing.

### Features

#### 13.1 Export Page to JSON
**Priority:** P1 (High)

**User Story:**
> As a page builder user, I want to export my page design as a JSON file, so that I can back it up, share it with others, or migrate to another platform.

**Technical Requirements:**

1. **Export Format**
   ```typescript
   interface PageExport {
     // Metadata
     version: string; // "1.0.0"
     exported_at: string; // ISO timestamp
     exported_by: string; // User ID or email

     // Page info
     page: {
       id: string;
       name: string;
       description: string;
       slug: string;
       status: 'draft' | 'published';

       // SEO settings
       seo: {
         title: string;
         description: string;
         og_title: string;
         og_description: string;
         og_image: string;
         twitter_card: string;
         robots_index: boolean;
         robots_follow: boolean;
       };

       // Elements array
       elements: Element[];

       // Page settings
       settings: {
         custom_css: string;
         custom_js: string;
         fonts: string[];
         integrations: Record<string, any>;
       };
     };
   }

   interface Element {
     id: string;
     type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'payment' | 'lead-form';
     order: number;
     version: number;
     props: Record<string, any>; // All element properties
   }
   ```

2. **Export API**
   ```typescript
   // GET /api/projects/[id]/export
   export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
     const projectId = params.id;

     // Verify ownership
     const { user } = await getUser();
     const project = await getProject(projectId);

     if (project.user_id !== user.id) {
       return new Response('Forbidden', { status: 403 });
     }

     // Get all elements
     const elements = await getElements(projectId);

     // Build export object
     const exportData: PageExport = {
       version: '1.0.0',
       exported_at: new Date().toISOString(),
       exported_by: user.email,
       page: {
         id: project.id,
         name: project.name,
         description: project.description,
         slug: project.slug,
         status: project.status,
         seo: project.seo_settings,
         elements: elements.map(el => ({
           id: el.id,
           type: el.type,
           order: el.order,
           version: el.version,
           props: el.props,
         })),
         settings: {
           custom_css: project.custom_css || '',
           custom_js: project.custom_js || '',
           fonts: project.fonts || [],
           integrations: project.integrations || {},
         },
       },
     };

     // Return as downloadable JSON
     return new Response(JSON.stringify(exportData, null, 2), {
       headers: {
         'Content-Type': 'application/json',
         'Content-Disposition': `attachment; filename="${project.slug}-export-${Date.now()}.json"`,
       },
     });
   }
   ```

3. **Dashboard Export Button**
   ```tsx
   // In project card
   <Button onClick={handleExport}>
     <DownloadIcon /> Export JSON
   </Button>

   async function handleExport(projectId: string) {
     const response = await fetch(`/api/projects/${projectId}/export`);
     const blob = await response.blob();

     // Trigger download
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `page-${projectId}.json`;
     a.click();
   }
   ```

**Data Sanitization:**
- Remove user-specific data (user_id, api keys)
- Remove timestamps (created_at, updated_at)
- Optionally anonymize customer data in examples

---

#### 13.2 Import Page from JSON
**Priority:** P1 (High)

**User Story:**
> As a page builder user, I want to import page designs from JSON files, so that I can use templates, restore backups, or migrate from other platforms.

**Technical Requirements:**

1. **Import Validation**
   ```typescript
   interface ImportValidator {
     validateVersion(version: string): boolean;
     validateStructure(data: any): boolean;
     validateElements(elements: Element[]): boolean;
     sanitizeData(data: PageExport): PageExport;
   }

   function validateImport(data: any): ValidationResult {
     // Check version compatibility
     if (!data.version || !isCompatibleVersion(data.version)) {
       return { valid: false, error: 'Incompatible version' };
     }

     // Validate structure
     if (!data.page || !data.page.elements || !Array.isArray(data.page.elements)) {
       return { valid: false, error: 'Invalid structure' };
     }

     // Validate element types
     const validTypes = ['hero', 'features', 'testimonials', 'pricing', 'payment', 'lead-form'];
     for (const element of data.page.elements) {
       if (!validTypes.includes(element.type)) {
         return { valid: false, error: `Invalid element type: ${element.type}` };
       }
     }

     return { valid: true };
   }
   ```

2. **Import API**
   ```typescript
   // POST /api/projects/import
   export async function POST(request: NextRequest) {
     const { user } = await getUser();
     const data = await request.json();

     // Validate import data
     const validation = validateImport(data);
     if (!validation.valid) {
       return NextResponse.json({ error: validation.error }, { status: 400 });
     }

     // Sanitize data
     const sanitized = sanitizeImportData(data);

     // Create new project
     const project = await createProject({
       user_id: user.id,
       name: sanitized.page.name + ' (Imported)',
       description: sanitized.page.description,
       status: 'draft', // Always import as draft
       seo_settings: sanitized.page.seo,
     });

     // Create elements
     for (const element of sanitized.page.elements) {
       await createElement({
         project_id: project.id,
         type: element.type,
         order: element.order,
         props: element.props,
         version: element.version,
       });
     }

     return NextResponse.json({
       success: true,
       project_id: project.id,
       message: 'Page imported successfully'
     });
   }
   ```

3. **Import UI**
   ```tsx
   <Dialog>
     <DialogTrigger asChild>
       <Button>
         <UploadIcon /> Import from JSON
       </Button>
     </DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Import Page Design</DialogTitle>
         <DialogDescription>
           Upload a JSON file exported from X.IDE or compatible page builder
         </DialogDescription>
       </DialogHeader>

       <div className="space-y-4">
         {/* File upload */}
         <Input
           type="file"
           accept=".json"
           onChange={handleFileSelect}
         />

         {/* Preview */}
         {fileData && (
           <div className="border rounded p-4">
             <h4>Preview:</h4>
             <p>Name: {fileData.page.name}</p>
             <p>Elements: {fileData.page.elements.length}</p>
             <p>Exported: {new Date(fileData.exported_at).toLocaleDateString()}</p>
           </div>
         )}

         {/* Import button */}
         <Button onClick={handleImport} disabled={!fileData}>
           Import Page
         </Button>
       </div>
     </DialogContent>
   </Dialog>

   async function handleImport() {
     const response = await fetch('/api/projects/import', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(fileData),
     });

     const result = await response.json();

     if (result.success) {
       toast.success('Page imported successfully!');
       router.push(`/projects/${result.project_id}/edit`);
     } else {
       toast.error(`Import failed: ${result.error}`);
     }
   }
   ```

**Import Options:**
- Import as new page (default)
- Import and merge with existing page
- Import only elements (skip settings)
- Import only settings (skip elements)

**Safety Features:**
- Always import as draft (never published)
- Generate new UUIDs for all records
- Sanitize external URLs and scripts
- Validate all element props
- Log import attempts for security

---

#### 13.3 Template Marketplace (Future)
**Priority:** P2 (Nice to have)

**Concept:**
- Users can share their designs as templates
- Template marketplace with free and paid templates
- Rating and review system
- Template categories (landing pages, sales pages, lead magnets)
- One-click template installation

**Future consideration:** Phase 16+

---

## Phase 14: WhatsApp Integration

### Overview
Add WhatsApp button to published pages, allowing customers to contact the seller directly via WhatsApp for inquiries, support, or sales.

### Features

#### 14.1 WhatsApp Contact Button
**Priority:** P1 (High)

**User Story:**
> As a sales page creator, I want to add a WhatsApp button to my pages, so that customers can easily reach me for questions, support, or to complete purchases via chat.

**Use Cases:**
- Customer support queries
- Pre-purchase questions
- Payment assistance
- Custom orders
- Relationship building

**Technical Requirements:**

1. **New Element Type: WhatsApp Button**
   ```typescript
   interface WhatsAppButtonElement {
     id: string;
     type: 'whatsapp-button';
     order: number;
     props: {
       // WhatsApp configuration
       phone_number: string; // Format: +60123456789
       country_code: string; // e.g., "60" for Malaysia
       default_message: string; // Pre-filled message

       // Display settings
       button_text: string; // e.g., "Chat on WhatsApp"
       button_style: 'fixed' | 'inline' | 'floating';
       button_position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'; // For fixed/floating
       button_color: string;
       button_size: 'small' | 'medium' | 'large';
       show_icon: boolean;

       // Behavior
       open_in: 'new-tab' | 'same-window';
       track_clicks: boolean;
     };
   }
   ```

2. **Generated WhatsApp Link**
   ```typescript
   function generateWhatsAppLink(element: WhatsAppButtonElement): string {
     const { phone_number, default_message } = element.props;

     // Remove all non-numeric characters
     const cleanNumber = phone_number.replace(/[^0-9]/g, '');

     // Encode message for URL
     const message = encodeURIComponent(default_message);

     // WhatsApp Web/App URL format
     return `https://wa.me/${cleanNumber}?text=${message}`;
   }
   ```

3. **HTML Generation**
   ```typescript
   function generateWhatsAppHTML(element: WhatsAppButtonElement): string {
     const link = generateWhatsAppLink(element);
     const { button_text, button_style, button_position, button_color, show_icon } = element.props;

     const styles = generateButtonStyles(button_style, button_position, button_color);
     const icon = show_icon ? generateWhatsAppIcon() : '';

     return `
       <a
         href="${link}"
         target="_blank"
         rel="noopener noreferrer"
         class="whatsapp-button"
         style="${styles}"
         onclick="trackWhatsAppClick('${element.id}')"
       >
         ${icon}
         <span>${button_text}</span>
       </a>

       ${button_style === 'floating' ? generateFloatingCSS() : ''}
     `;
   }
   ```

4. **Button Styles**

   **Fixed/Floating Button:**
   ```css
   .whatsapp-button.floating {
     position: fixed;
     bottom: 20px;
     right: 20px;
     z-index: 1000;

     display: flex;
     align-items: center;
     gap: 8px;

     padding: 12px 20px;
     border-radius: 50px;
     background-color: #25D366; /* WhatsApp green */
     color: white;

     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
     transition: transform 0.2s, box-shadow 0.2s;

     text-decoration: none;
     font-weight: 500;
   }

   .whatsapp-button.floating:hover {
     transform: scale(1.05);
     box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
   }
   ```

   **Inline Button:**
   ```css
   .whatsapp-button.inline {
     display: inline-flex;
     align-items: center;
     gap: 8px;

     padding: 12px 24px;
     border-radius: 8px;
     background-color: #25D366;
     color: white;

     text-decoration: none;
     font-weight: 600;
     transition: background-color 0.2s;
   }

   .whatsapp-button.inline:hover {
     background-color: #20BA5A;
   }
   ```

5. **Analytics Tracking**
   ```typescript
   // Track WhatsApp button clicks
   function trackWhatsAppClick(elementId: string) {
     fetch('/api/analytics/track', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         event_type: 'whatsapp_click',
         element_id: elementId,
         timestamp: new Date().toISOString(),
         metadata: {
           user_agent: navigator.userAgent,
           referrer: document.referrer,
         },
       }),
     });
   }

   // Database
   CREATE INDEX idx_analytics_whatsapp ON analytics_events(event_type)
   WHERE event_type = 'whatsapp_click';
   ```

6. **Dashboard Configuration**
   ```tsx
   // Element editor panel
   <div className="space-y-4">
     <div>
       <Label>WhatsApp Phone Number</Label>
       <Input
         type="tel"
         placeholder="+60123456789"
         value={props.phone_number}
         onChange={(e) => updateProp('phone_number', e.target.value)}
       />
       <p className="text-sm text-muted-foreground">
         Include country code (e.g., +60 for Malaysia)
       </p>
     </div>

     <div>
       <Label>Default Message</Label>
       <Textarea
         placeholder="Hi! I'm interested in..."
         value={props.default_message}
         onChange={(e) => updateProp('default_message', e.target.value)}
       />
       <p className="text-sm text-muted-foreground">
         This message will be pre-filled when customer opens WhatsApp
       </p>
     </div>

     <div>
       <Label>Button Text</Label>
       <Input
         value={props.button_text}
         onChange={(e) => updateProp('button_text', e.target.value)}
       />
     </div>

     <div>
       <Label>Button Style</Label>
       <Select
         value={props.button_style}
         onValueChange={(val) => updateProp('button_style', val)}
       >
         <SelectItem value="inline">Inline</SelectItem>
         <SelectItem value="floating">Floating</SelectItem>
         <SelectItem value="fixed">Fixed Position</SelectItem>
       </Select>
     </div>

     {props.button_style !== 'inline' && (
       <div>
         <Label>Position</Label>
         <Select
           value={props.button_position}
           onValueChange={(val) => updateProp('button_position', val)}
         >
           <SelectItem value="bottom-right">Bottom Right</SelectItem>
           <SelectItem value="bottom-left">Bottom Left</SelectItem>
           <SelectItem value="top-right">Top Right</SelectItem>
           <SelectItem value="top-left">Top Left</SelectItem>
         </Select>
       </div>
     )}

     <div>
       <Label>Button Color</Label>
       <Input
         type="color"
         value={props.button_color}
         onChange={(e) => updateProp('button_color', e.target.value)}
       />
     </div>

     <div className="flex items-center gap-2">
       <Switch
         checked={props.show_icon}
         onCheckedChange={(val) => updateProp('show_icon', val)}
       />
       <Label>Show WhatsApp Icon</Label>
     </div>
   </div>
   ```

**Best Practices:**
- Always use WhatsApp brand green (#25D366) as default
- Include country code in phone number
- Keep default message concise and relevant
- Test on both mobile and desktop
- Don't spam - one button per page
- Consider timezone when responding

---

## Phase 15: Advanced Analytics

### Overview
Integrate Google Analytics 4 (GA4) and build a comprehensive digital marketing analytics dashboard to track user behavior, conversions, and campaign performance.

### Features

#### 15.1 GA4 Integration
**Priority:** P1 (High)

**User Story:**
> As a marketer, I want to integrate Google Analytics 4 with my sales pages, so that I can track traffic sources, user behavior, and conversion metrics in Google Analytics.

**Technical Requirements:**

1. **GA4 Configuration**
   ```typescript
   interface GA4Config {
     measurement_id: string; // G-XXXXXXXXXX
     enabled: boolean;
     enhanced_measurement: boolean;
     debug_mode: boolean;
   }
   ```

2. **Global Site Tag (gtag.js) Injection**
   ```typescript
   function generateGA4Script(config: GA4Config): string {
     if (!config.enabled) return '';

     return `
       <!-- Google Analytics 4 -->
       <script async src="https://www.googletagmanager.com/gtag/js?id=${config.measurement_id}"></script>
       <script>
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());

         gtag('config', '${config.measurement_id}', {
           ${config.debug_mode ? "'debug_mode': true," : ''}
           'send_page_view': true
         });
       </script>
     `;
   }
   ```

3. **Event Tracking**
   ```typescript
   // Track custom events
   function trackEvent(eventName: string, params: Record<string, any>) {
     if (typeof gtag !== 'undefined') {
       gtag('event', eventName, params);
     }
   }

   // Payment events
   trackEvent('begin_checkout', {
     currency: 'MYR',
     value: 99.00,
     items: [{
       item_id: 'product-123',
       item_name: 'My Ebook',
       price: 99.00,
       quantity: 1
     }]
   });

   trackEvent('purchase', {
     transaction_id: 'INV-123',
     value: 99.00,
     currency: 'MYR',
     items: [...]
   });

   // Lead events
   trackEvent('generate_lead', {
     lead_type: 'contact_form',
     value: 0
   });

   // WhatsApp clicks
   trackEvent('whatsapp_click', {
     element_id: 'wa-btn-123'
   });
   ```

4. **Settings UI**
   ```tsx
   // Dashboard settings page
   <Card>
     <CardHeader>
       <CardTitle>Google Analytics 4</CardTitle>
       <CardDescription>
         Connect your GA4 property to track page views, events, and conversions
       </CardDescription>
     </CardHeader>
     <CardContent className="space-y-4">
       <div>
         <Label>Measurement ID</Label>
         <Input
           placeholder="G-XXXXXXXXXX"
           value={ga4Config.measurement_id}
           onChange={(e) => setGA4Config({ ...ga4Config, measurement_id: e.target.value })}
         />
         <p className="text-sm text-muted-foreground">
           Find this in your GA4 property settings
         </p>
       </div>

       <div className="flex items-center gap-2">
         <Switch
           checked={ga4Config.enabled}
           onCheckedChange={(val) => setGA4Config({ ...ga4Config, enabled: val })}
         />
         <Label>Enable tracking</Label>
       </div>

       <Button onClick={handleSaveGA4Config}>
         Save GA4 Settings
       </Button>
     </CardContent>
   </Card>
   ```

---

#### 15.2 Digital Marketing Analytics Dashboard
**Priority:** P1 (High)

**User Story:**
> As a marketer, I want a comprehensive analytics dashboard that pulls data from GA4 and my application database, so that I can analyze traffic, behavior, and conversions in one place.

**Dashboard Sections:**

**1. Overview**
```tsx
<div className="grid gap-4 md:grid-cols-4">
  <MetricCard
    title="Total Visitors"
    value="1,234"
    change="+12.3%"
    period="vs last month"
    icon={<UsersIcon />}
  />
  <MetricCard
    title="Page Views"
    value="4,567"
    change="+8.2%"
    period="vs last month"
    icon={<EyeIcon />}
  />
  <MetricCard
    title="Conversions"
    value="89"
    change="+23.5%"
    period="vs last month"
    icon={<TrendingUpIcon />}
  />
  <MetricCard
    title="Revenue"
    value="RM 8,910"
    change="+15.7%"
    period="vs last month"
    icon={<DollarIcon />}
  />
</div>
```

**2. Traffic Sources**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Traffic Sources</CardTitle>
  </CardHeader>
  <CardContent>
    <PieChart
      data={[
        { source: 'Organic Search', value: 45, color: '#4CAF50' },
        { source: 'Direct', value: 25, color: '#2196F3' },
        { source: 'Social Media', value: 20, color: '#FF9800' },
        { source: 'Referral', value: 10, color: '#9C27B0' },
      ]}
    />

    <div className="mt-4 space-y-2">
      {trafficSources.map(source => (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
            <span>{source.source}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-muted-foreground">{source.visitors} visitors</span>
            <span className="font-medium">{source.percentage}%</span>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

**3. User Behavior Flow**
```tsx
<Card>
  <CardHeader>
    <CardTitle>User Journey</CardTitle>
    <CardDescription>
      See how users navigate through your pages
    </CardDescription>
  </CardHeader>
  <CardContent>
    <SankeyDiagram
      nodes={[
        { id: 'landing', label: 'Landing Page', value: 1000 },
        { id: 'product', label: 'Product Section', value: 750 },
        { id: 'payment', label: 'Payment', value: 200 },
        { id: 'success', label: 'Success', value: 180 },
        { id: 'exit', label: 'Exit', value: 820 },
      ]}
      links={[
        { source: 'landing', target: 'product', value: 750 },
        { source: 'landing', target: 'exit', value: 250 },
        { source: 'product', target: 'payment', value: 200 },
        { source: 'product', target: 'exit', value: 550 },
        { source: 'payment', target: 'success', value: 180 },
        { source: 'payment', target: 'exit', value: 20 },
      ]}
    />
  </CardContent>
</Card>
```

**4. Conversion Funnel**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Conversion Funnel</CardTitle>
  </CardHeader>
  <CardContent>
    <FunnelChart
      stages={[
        { name: 'Page Visitors', value: 1000, percentage: 100 },
        { name: 'Clicked CTA', value: 600, percentage: 60 },
        { name: 'Opened Payment', value: 300, percentage: 30 },
        { name: 'Selected Bank', value: 250, percentage: 25 },
        { name: 'Completed Payment', value: 180, percentage: 18 },
      ]}
    />

    <div className="mt-4">
      <h4 className="font-medium mb-2">Drop-off Analysis</h4>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between">
          <span>Visitors → CTA Click:</span>
          <span className="text-red-600">40% drop-off</span>
        </li>
        <li className="flex justify-between">
          <span>CTA Click → Payment:</span>
          <span className="text-orange-600">50% drop-off</span>
        </li>
        <li className="flex justify-between">
          <span>Payment → Completion:</span>
          <span className="text-yellow-600">40% drop-off</span>
        </li>
      </ul>
    </div>
  </CardContent>
</Card>
```

**5. Real-time Analytics**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Real-time Activity</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Active Users Now</span>
        <span className="text-2xl font-bold">23</span>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Recent Events</h4>
        <div className="space-y-2">
          {recentEvents.map(event => (
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">{event.time}</span>
              <span>{event.event_name}</span>
              <span className="text-muted-foreground">- {event.location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

**6. Campaign Performance**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Campaign Performance</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Visitors</TableHead>
          <TableHead>Conversions</TableHead>
          <TableHead>Conversion Rate</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>ROAS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Facebook Ads - Summer Sale</TableCell>
          <TableCell>1,234</TableCell>
          <TableCell>89</TableCell>
          <TableCell>7.2%</TableCell>
          <TableCell>RM 8,910</TableCell>
          <TableCell>3.2x</TableCell>
        </TableRow>
        {/* More campaigns */}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

**Technical Implementation:**

1. **GA4 Data API Integration**
   ```typescript
   // lib/ga4-api.ts
   import { BetaAnalyticsDataClient } from '@google-analytics/data';

   const analyticsDataClient = new BetaAnalyticsDataClient({
     credentials: {
       client_email: process.env.GA4_CLIENT_EMAIL,
       private_key: process.env.GA4_PRIVATE_KEY,
     },
   });

   export async function getPageViews(propertyId: string, startDate: string, endDate: string) {
     const [response] = await analyticsDataClient.runReport({
       property: `properties/${propertyId}`,
       dateRanges: [{ startDate, endDate }],
       dimensions: [{ name: 'date' }],
       metrics: [{ name: 'screenPageViews' }],
     });

     return response.rows?.map(row => ({
       date: row.dimensionValues[0].value,
       views: parseInt(row.metricValues[0].value),
     }));
   }
   ```

2. **Combined Analytics API**
   ```typescript
   // app/api/analytics/dashboard/route.ts
   export async function GET(request: NextRequest) {
     const { user } = await getUser();
     const projectId = searchParams.get('project_id');

     // Get data from multiple sources
     const [ga4Data, dbData] = await Promise.all([
       getGA4Analytics(projectId),
       getDatabaseAnalytics(projectId),
     ]);

     return NextResponse.json({
       overview: {
         visitors: ga4Data.totalUsers,
         pageViews: ga4Data.pageViews,
         conversions: dbData.transactions.length,
         revenue: dbData.totalRevenue,
       },
       traffic: ga4Data.trafficSources,
       behavior: ga4Data.userJourney,
       conversions: dbData.conversionFunnel,
       realtime: ga4Data.realtimeUsers,
     });
   }
   ```

**Success Metrics:**
- Data accuracy (GA4 vs database reconciliation)
- Dashboard load time < 2 seconds
- Real-time update latency < 30 seconds
- User engagement with analytics dashboard

---

## Technical Considerations

### Database Schema Updates

**New Tables:**
```sql
-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  project_id UUID REFERENCES projects(id),
  form_id TEXT,
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  message TEXT,
  custom_fields JSONB,
  has_payment BOOLEAN DEFAULT false,
  transaction_id UUID REFERENCES transactions(id),
  lead_value NUMERIC,
  status TEXT DEFAULT 'new',
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, customer_email)
);

-- GA4 Configuration
CREATE TABLE ga4_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  project_id UUID REFERENCES projects(id),
  measurement_id TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  enhanced_measurement BOOLEAN DEFAULT true,
  debug_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Enhanced analytics events
ALTER TABLE analytics_events ADD COLUMN lead_id UUID REFERENCES leads(id);
ALTER TABLE analytics_events ADD COLUMN transaction_id UUID REFERENCES transactions(id);
```

### API Routes to Create

```
POST   /api/forms/submit-lead
POST   /api/forms/submit-lead-with-payment
GET    /api/leads
GET    /api/leads/[id]
PATCH  /api/leads/[id]
DELETE /api/leads/[id]
GET    /api/leads/export

POST   /api/projects/import
GET    /api/projects/[id]/export

GET    /api/analytics/ga4/overview
GET    /api/analytics/ga4/traffic
GET    /api/analytics/ga4/behavior
GET    /api/analytics/ga4/realtime
GET    /api/analytics/dashboard
```

### External Dependencies

```json
{
  "dependencies": {
    "@google-analytics/data": "^4.0.0",
    "recharts": "^2.5.0",
    "d3-sankey": "^0.12.3",
    "react-flow-renderer": "^10.3.17"
  }
}
```

### Performance Considerations

1. **Analytics Dashboard**
   - Cache GA4 API responses for 5 minutes
   - Use Redis for real-time data aggregation
   - Implement pagination for large datasets
   - Use web workers for heavy calculations

2. **Import/Export**
   - File size limit: 10MB
   - Validate JSON schema before processing
   - Queue large imports for background processing
   - Show progress bar during import

3. **Lead Forms**
   - Rate limiting: 10 submissions per IP per hour
   - Spam detection using honeypot fields
   - reCAPTCHA for high-traffic pages

---

## Open Questions

### Phase 12: Lead Generation

**Q1:** Should we allow duplicate emails across different projects?
- **Option A:** Allow (different products can have same leads)
- **Option B:** Prevent (one lead per email globally)
- **Recommendation:** Allow per-project, prevent duplicates within project

**Q2:** Email delivery service for auto-responders?
- **Options:** SendGrid, Resend, AWS SES, Postmark
- **Recommendation:** Resend (best developer experience)

**Q3:** Lead scoring system?
- Should we automatically score leads based on behavior?
- What metrics: page time, number of visits, engagement?

### Phase 13: Import/Export

**Q4:** Version compatibility?
- How many versions back should we support?
- Migration scripts for breaking changes?

**Q5:** Export user data?
- Should export include transaction history?
- How to handle PII (personally identifiable information)?

### Phase 14: WhatsApp

**Q6:** WhatsApp Business API?
- Free wa.me links vs paid Business API?
- Auto-reply capabilities?

**Q7:** Multiple contact methods?
- Support for Telegram, Line, WeChat?
- Universal messaging component?

### Phase 15: Analytics

**Q8:** Real-time requirements?
- How real-time? (< 30s, < 5s, < 1s?)
- WebSocket connection for dashboard?

**Q9:** Data retention?
- How long to keep analytics data?
- Archival strategy for old data?

**Q10:** Third-party integrations?
- Facebook Pixel, LinkedIn Insight Tag?
- Google Tag Manager support?

---

## Priority Matrix

| Phase | Feature | Priority | Effort | Impact | Timeline |
|-------|---------|----------|--------|--------|----------|
| 12 | Lead Form (Simple) | P0 | Medium | High | 1-2 weeks |
| 12 | Lead Form + Payment | P1 | High | High | 2-3 weeks |
| 14 | WhatsApp Button | P1 | Low | Medium | 1 week |
| 13 | Export JSON | P1 | Medium | Medium | 1-2 weeks |
| 13 | Import JSON | P1 | High | Medium | 2-3 weeks |
| 15 | GA4 Integration | P1 | Medium | High | 1-2 weeks |
| 15 | Analytics Dashboard | P1 | Very High | Very High | 4-6 weeks |

**Recommended Order:**
1. **Phase 12.1** - Lead Form (Simple) ← Most requested, quickest impact
2. **Phase 14** - WhatsApp Button ← Easy win, high user value
3. **Phase 13.1** - Export JSON ← Enable template sharing
4. **Phase 12.2** - Lead Form + Payment ← Combine lead gen with revenue
5. **Phase 13.2** - Import JSON ← Complete import/export system
6. **Phase 15.1** - GA4 Integration ← Foundation for analytics
7. **Phase 15.2** - Analytics Dashboard ← Comprehensive insights

---

## Success Metrics

### Phase 12 Success Criteria
- 80% of users create at least one lead form
- Lead form completion rate > 60%
- Lead-to-payment conversion rate > 15%

### Phase 13 Success Criteria
- 50% of users export at least one page
- 30% of users import a template
- Zero data loss during import/export

### Phase 14 Success Criteria
- 70% of published pages have WhatsApp button
- Average click-through rate > 5%
- Customer satisfaction score > 4.5/5

### Phase 15 Success Criteria
- 90% of users connect GA4
- Dashboard used by 80% of active users
- Data accuracy > 98% (GA4 vs database)

---

**Document Status:** Draft for Review
**Next Steps:**
1. Review and prioritize with stakeholders
2. Create detailed PRDs for Phase 12
3. Begin technical architecture design
4. Set up project tracking (Jira/Linear)

**Last Updated:** January 15, 2026
