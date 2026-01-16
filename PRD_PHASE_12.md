# Product Requirements Document - Phase 12

## Overview
Phase 12 focuses on enhancing user engagement and conversion capabilities through new interactive elements and improved builder functionality.

## Release Version
Version: 1.12.0
Date: January 2026

---

## 1. WhatsApp Click-to-Chat Button Element

### Objective
Enable users to add WhatsApp contact buttons to their sales pages for direct customer communication, supporting both floating and inline button styles.

### Features

#### 1.1 Button Component
- **Phone Number Configuration**
  - Support for international phone numbers with country codes
  - Automatic cleaning of phone number formatting
  - Validation and helper text for proper format

- **Pre-filled Message**
  - Optional pre-filled message that appears when chat opens
  - Supports custom greeting/inquiry text
  - URL-encoded for proper WhatsApp API compatibility

#### 1.2 Button Styling
- **Size Options**
  - Small (sm): Compact button for subtle placement
  - Medium (md): Standard size for general use
  - Large (lg): Prominent button for high-visibility CTAs

- **Color Customization**
  - Default WhatsApp green (#25D366)
  - Custom color picker with hex input
  - Maintains white text for contrast

- **Icon Display**
  - Default WhatsApp icon (MessageCircle SVG)
  - Optional custom icon via URL
  - Toggle to show/hide icon
  - Responsive icon sizing based on button size

#### 1.3 Position Modes

**Fixed Position (Floating)**
- Floats above page content
- Position options:
  - Bottom Right (default)
  - Bottom Left
  - Top Right
  - Top Left
- Sticky behavior - follows scroll
- High z-index for visibility
- Pulse animation effect for attention
- Tooltip on hover with customizable text

**Inline Position**
- Embedded within page content flow
- No fixed positioning
- No pulse animation
- Standard hover effects only

#### 1.4 Properties Panel Configuration
Users can customize:
- Phone number (with country code guidance)
- Pre-filled message text
- Button text label
- Button color (color picker + hex input)
- Button size (sm/md/lg dropdown)
- Position type (Fixed/Inline)
- Fixed position location (conditional)
- Show/hide icon toggle
- Custom icon URL (conditional)
- Tooltip text (conditional for fixed position)

#### 1.5 Published Page Functionality
- Generates proper WhatsApp URL: `https://wa.me/{phone}?text={message}`
- Opens in new tab with security attributes
- Analytics tracking via gtag events
- Responsive design for mobile/desktop
- Prevents action in builder preview mode
- Clean HTML/CSS generation without framework dependencies

---

## 2. Builder Experience Improvements

### 2.1 Temporary Project Support
- **Problem Solved**: Elements couldn't be added when accessing builder directly without choosing a template
- **Solution**: Automatic temporary project creation for all users
  - Guest users: `guest-project` ID
  - Logged-in users: `temp-project-{userId}` ID
  - Projects persist in memory until saved

### 2.2 Save Functionality Enhancement
- **Temporary Project Detection**
  - Identifies unsaved temporary projects
  - Prompts for project name and description
  - Checks project limit before creating
  - Creates database record and migrates elements
  - Updates URLs to proper edit page

- **Project Limit Validation**
  - Free tier: 3 projects maximum
  - Pro tier: Unlimited projects
  - Clear feedback on limit reached

---

## 3. Google OAuth Integration (DEPLOYED)

### Objective
Enable per-user Google Sheets integration via OAuth instead of shared service account, allowing each user to connect their own Google account.

### Implementation Status
**✅ Completed and Deployed to Production**

#### 3.1 Database Schema
- `user_integrations` table with RLS policies
- Stores encrypted OAuth tokens per user
- Supports multiple integration types (Google Sheets, Drive, etc.)
- Token expiry tracking and automatic refresh

#### 3.2 OAuth Flow
- Authorization initiation endpoint
- Callback handler with state verification (CSRF protection)
- Token encryption using AES-256-GCM
- Automatic token refresh logic with fallback
- Secure cookie-based state management
- Proper SSR authentication using `@supabase/ssr`

#### 3.3 API Routes (All Deployed)
- `/api/oauth/google/connect` - Initiate OAuth flow (redirects to Google)
- `/api/oauth/google/callback` - Handle OAuth callback and store tokens
- `/api/oauth/google/disconnect` - Revoke access and delete tokens
- `/api/oauth/google/test-config` - Debug endpoint to verify OAuth configuration
- `/api/oauth/google/test-sheet-access` - Test endpoint to verify sheet access

#### 3.4 Integration UI
- Connection status display in settings
- One-click connect/disconnect buttons
- Connected account information display
- Google account email shown when connected
- Clear setup instructions and documentation

#### 3.5 Lead Form Google Sheets Integration
- **Automatic Sync**: When enabled, leads automatically sync to user's Google Sheet
- **Sheet URL Configuration**: Users paste their Google Sheet URL in lead form properties
- **Per-User Authentication**: Each user's OAuth token is used for their own sheets
- **Fallback Support**: Falls back to service account if OAuth not configured
- **Error Handling**: Silent failures don't block lead submission
- **Auto-Headers**: Automatically creates header row if sheet is empty
- **Header Formatting**: Bold, dark background with white text
- **Data Structure**: Timestamp, Name, Email, Phone, Message, Status, IP Address, Referrer

#### 3.6 Production Deployment Issues Resolved
- **Authentication Fix**: Updated OAuth routes to use `createServerClient` from `@supabase/ssr` with proper cookie handling
- **Environment Variables**: Fixed newline character issues in OAuth credentials by using `printf` instead of `echo` in Vercel CLI
- **Google 400 Error**: Resolved "malformed request" error caused by `\n` in `client_id` parameter
- **JavaScript Syntax**: Fixed template literal issues and emoji characters in generated form HTML
- **Form Success Message**: Fixed missing quote in CSS color property causing JavaScript crash
- **Debugging**: Added comprehensive logging to track Google Sheets sync attempts and failures

#### 3.7 Testing & Debugging Tools
- Test config endpoint shows OAuth configuration (client ID, redirect URI, auth URL)
- Test sheet access endpoint verifies user can access their Google Sheet
- Browser console logging shows sync success/failure in real-time
- Server-side logging tracks sheet configuration and sync attempts
- Debug info returned in API responses for troubleshooting

### Current Status
- ✅ OAuth flow working in production
- ✅ Users can connect Google accounts
- ✅ Lead forms can sync to Google Sheets
- ✅ Comprehensive error handling and logging
- ✅ Test endpoints for debugging
- ⚠️ Awaiting user testing confirmation for full functionality verification

---

## 4. Technical Specifications

### 4.1 File Structure
```
components/
  builder/
    elements/
      WhatsAppButton.tsx          # WhatsApp button component
      index.ts                     # Updated exports
    Canvas.tsx                     # Added WhatsApp rendering
    ElementLibrary.tsx             # Added WhatsApp template
    PropertiesPanel.tsx            # Added WhatsApp properties UI
    Toolbar.tsx                    # Enhanced save functionality

lib/
  publishing/
    html-generator.ts              # Added WhatsApp HTML generation
  oauth/
    google-oauth.ts                # OAuth utilities (not deployed)
  google-sheets.ts                 # Updated for OAuth support

types/
  index.ts                         # Added whatsapp_button type

app/
  builder/
    page.tsx                       # Temporary project creation
  api/
    oauth/
      google/                      # OAuth endpoints (not deployed)

supabase/
  migrations/
    20260116000000_add_google_oauth_integration.sql  # OAuth schema
```

### 4.2 Google OAuth Environment Variables
Required environment variables for production:
```env
GOOGLE_OAUTH_CLIENT_ID=<from Google Cloud Console>
GOOGLE_OAUTH_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_OAUTH_REDIRECT_URI=https://ide-page-builder.vercel.app/api/oauth/google/callback
OAUTH_ENCRYPTION_KEY=<32-byte random string for AES-256>
NEXT_PUBLIC_APP_URL=https://ide-page-builder.vercel.app
```

**Important**: Use `printf` instead of `echo` when adding env vars via Vercel CLI to avoid newline characters.

### 4.3 WhatsApp Button Props Interface
```typescript
interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  buttonText: string;
  buttonColor: string;
  buttonSize: 'sm' | 'md' | 'lg';
  position: 'fixed' | 'inline';
  fixedPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showIcon: boolean;
  customIcon?: string;
  tooltipText?: string;
}
```

### 4.4 Default WhatsApp Button Configuration
- Phone: 60123456789 (Malaysia format example)
- Message: "Hi! I'm interested in your product."
- Button Text: "Chat on WhatsApp"
- Color: #25D366 (WhatsApp green)
- Size: Medium
- Position: Fixed bottom-right
- Show Icon: Yes
- Tooltip: "Need help? Chat with us!"

---

## 5. User Experience

### 5.1 Builder Workflow
1. User clicks WhatsApp Button in element library
2. Button appears on canvas with default settings
3. Click button to open properties panel
4. Customize phone number, message, styling, and position
5. Preview live changes in canvas
6. Save and publish page

### 5.2 Visitor Interaction
**Fixed Position Buttons:**
- Float in chosen corner of page
- Follow user as they scroll
- Show tooltip on hover
- Pulse animation draws attention
- Click opens WhatsApp with pre-filled message

**Inline Buttons:**
- Appear in page content flow
- Standard button styling
- Hover effect (scale 1.05)
- Click opens WhatsApp with pre-filled message

### 5.3 Analytics
- WhatsApp button clicks tracked via gtag
- Event category: "WhatsApp"
- Event label: Element ID
- Integrates with existing analytics system

---

## 6. Testing Requirements

### 6.1 Functional Testing
- [ ] Add WhatsApp button from library
- [ ] Customize all properties
- [ ] Preview in builder (mobile/tablet/desktop)
- [ ] Test fixed vs inline positioning
- [ ] Test all fixed position options
- [ ] Verify phone number formatting
- [ ] Test custom vs default icon
- [ ] Verify tooltip display
- [ ] Test in published page
- [ ] Verify WhatsApp URL generation
- [ ] Test on actual mobile device
- [ ] Verify analytics tracking

### 6.2 Builder Testing
- [ ] Access builder directly without template
- [ ] Add elements to temporary project
- [ ] Save temporary project with custom name
- [ ] Verify project limit checking
- [ ] Test as guest user
- [ ] Test as logged-in user

### 6.3 Cross-browser Testing
- [ ] Chrome/Edge (Desktop & Mobile)
- [ ] Safari (macOS & iOS)
- [ ] Firefox (Desktop & Mobile)

---

## 7. Future Enhancements

### 7.1 Short-term (Phase 13)
- Deploy Google OAuth integration
- Add WhatsApp button templates/presets
- Add click tracking to dashboard analytics
- Add A/B testing for button variations

### 7.2 Medium-term
- Multi-language support for button text
- Business hours display with availability status
- Multiple WhatsApp numbers with team routing
- Department/team selection before chat
- Integration with WhatsApp Business API

### 7.3 Long-term
- Live chat widget alternative
- Chatbot integration for initial responses
- Automated message templates based on page context
- CRM integration for lead tracking
- Conversation analytics dashboard

---

## 8. Success Metrics

### 8.1 Adoption Metrics
- % of users adding WhatsApp buttons
- Average WhatsApp buttons per page
- Fixed vs inline position preference
- Custom color adoption rate

### 8.2 Engagement Metrics
- WhatsApp button click-through rate
- Time from page view to WhatsApp click
- Conversion rate: visitor → WhatsApp lead
- Return visitor engagement with WhatsApp

### 8.3 Technical Metrics
- WhatsApp button render performance
- Mobile vs desktop click rates
- Button position effectiveness (by location)
- Page load impact (should be negligible)

---

## 9. Documentation

### 9.1 User Documentation Needed
- [ ] WhatsApp button setup guide
- [ ] Best practices for phone number format
- [ ] Position selection recommendations
- [ ] Message template suggestions
- [ ] Mobile optimization tips

### 9.2 Developer Documentation
- [x] Component API documentation (in code)
- [x] Props interface definition
- [x] HTML generation implementation
- [ ] Analytics integration guide
- [ ] Custom styling examples

---

## 10. Known Limitations

### Current Limitations
1. No WhatsApp message character limit validation
2. No phone number validation beyond format cleaning
3. No multi-number support (one per button)
4. No business hours/availability indicator
5. No read receipt or message status
6. Requires visitor to have WhatsApp installed

### Technical Debt
1. Pre-existing TypeScript errors in payment/OAuth files
2. Google OAuth integration built but not deployed
3. Alert component missing for OAuth integration UI

---

## Appendix A: WhatsApp URL Format

The WhatsApp click-to-chat API uses this format:
```
https://wa.me/{phone}?text={encodedMessage}
```

Examples:
- Malaysia: `https://wa.me/60123456789?text=Hi%2C%20interested%20in%20your%20product`
- USA: `https://wa.me/14155551234?text=Hello`
- No message: `https://wa.me/60123456789`

Rules:
- Phone must include country code
- Remove all non-digit characters
- Message must be URL-encoded
- Opens in new tab/window
- Redirects to WhatsApp Web or mobile app

---

## Appendix B: Button Design Specifications

### Size Specifications
| Size | Padding | Font Size | Icon Size |
|------|---------|-----------|-----------|
| sm   | 0.5rem 1rem | 0.875rem | 16px |
| md   | 0.75rem 1.5rem | 1rem | 20px |
| lg   | 1rem 2rem | 1.125rem | 24px |

### Fixed Position Offsets
- All positions: 1.5rem from edges
- Z-index: 9999 (highest priority)
- Shadow: Large for prominence

### Animation Specifications
- Hover scale: 1.05
- Transition duration: 300ms
- Pulse animation: 2s infinite
- Pulse scale: 1.5 at 75-100%
- Tooltip fade: 200ms

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 16, 2026 | Development Team | Initial Phase 12 documentation |
