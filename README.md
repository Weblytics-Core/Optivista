# Modern Photography Portfolio

## 📸 Project Overview

**A modern, full-stack photography portfolio web application built with cutting-edge web technologies. It serves as a sophisticated platform for showcasing high-resolution photography, managing image galleries, and engaging with visitors through contact forms. The application combines a beautiful frontend interface with powerful backend capabilities powered by Firebase and AI-driven features.

**Version:** 0.1.0  
**Type:** Full-Stack Web Application  
**Status:** Active Development

---

## 🎯 Key Features

### 1. **Photography Gallery**
- Responsive image gallery displaying curated photography collections
- Image detail dialogs for viewing full resolution photos
- Dynamic placeholder image system with fallback data
- Support for remote image URLs with HTTP/HTTPS protocols

### 2. **Contact Form & Communication**
- Integrated contact form on the homepage
- Form submissions stored in Firestore with timestamps
- Email action capabilities for contact management
- Real-time form validation and user feedback via toast notifications

### 3. **Admin Dashboard**
- Secure admin panel accessible only to authenticated users
- **Image Management:** Upload, organize, and manage gallery images
- **Settings Configuration:** Customize site metadata (site name, headlines, etc.)
- **Downloads Management:** Manage downloadable resources
- **Admin Sidebar Navigation:** Easy access to all admin functions

### 4. **User Authentication**
- Firebase Authentication integration
- Login/Signup pages with form validation
- Email verification system
- User profile management
- Session persistence with cookies

### 5. **AI-Powered Features**
- **Genkit Integration:** Google Generative AI (Gemini 2.5 Flash) for intelligent processing
- **Contact Form Analysis:** AI-driven sentiment analysis of contact form submissions
- **Automated Analysis Flows:** Genkit flows for processing incoming messages
- Real-time AI processing without blocking user interactions

### 6. **Responsive Design**
- Mobile-first responsive layout
- Dark/Light theme toggle
- Accessibility-focused UI components (Radix UI)
- Optimized for all screen sizes

### 7. **Image Watermarking**
- Watermark component for protecting portfolio images
- Customizable watermark implementation

### 8. **Theme Management**
- Next Themes integration for theme persistence
- Context-based theme provider
- Theme toggle component in header/footer

---

## 🏗️ Architecture & Tech Stack

### **Frontend Technologies**
- **Framework:** Next.js 15.5.7 (React 18.3.1)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (15+ component libraries)
- **Form Handling:** React Hook Form with Zod resolvers
- **Icons:** Lucide React (475+ icons)
- **Image Carousel:** Embla Carousel React
- **Theme Management:** Next Themes
- **Date Utilities:** date-fns

### **Backend Technologies**
- **Runtime:** Node.js with Firebase App Hosting
- **Database:** Firestore (NoSQL)
- **Authentication:** Firebase Auth
- **Storage:** Firebase Cloud Storage
- **Admin SDK:** Firebase Admin SDK (v12.1.1)
- **AI/ML:** Google Genkit with Gemini 2.5 Flash

### **Development Tools**
- **Build System:** Next.js Build (with TypeScript type checking)
- **Package Manager:** npm
- **Linting:** ESLint (via Next.js)
- **Type Checking:** TypeScript strict mode
- **Patch Management:** Patch Package

---

## 📁 Project Structure

```
Optivista/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                 # Home page with gallery
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   ├── admin/                   # Admin dashboard
│   │   │   ├── page.tsx            # Admin main page
│   │   │   ├── layout.tsx          # Admin layout with sidebar
│   │   │   ├── downloads/          # Download management
│   │   │   ├── images/             # Image management
│   │   │   └── settings/           # Site settings
│   │   ├── contact/                # Contact page
│   │   ├── gallery/                # Gallery view page
│   │   ├── login/                  # Login page
│   │   ├── profile/                # User profile
│   │   ├── signup/                 # Registration page
│   │   ├── verify-email/           # Email verification
│   │   ├── privacy-policy/         # Legal pages
│   │   └── terms-of-service/       # Legal pages
│   │
│   ├── components/                  # React Components
│   │   ├── contact-form.tsx        # Contact form component
│   │   ├── watermarked-image.tsx   # Image watermarking
│   │   ├── image-card.tsx          # Gallery card display
│   │   ├── image-detail-dialog.tsx # Image details modal
│   │   ├── main-layout.tsx         # Main page layout wrapper
│   │   ├── site-header.tsx         # Navigation header
│   │   ├── site-footer.tsx         # Footer component
│   │   ├── theme-provider.tsx      # Theme context provider
│   │   ├── theme-toggle.tsx        # Dark/light mode toggle
│   │   ├── FirebaseErrorListener.tsx # Error handling
│   │   ├── admin/                  # Admin-specific components
│   │   │   ├── add-image-dialog.tsx
│   │   │   └── admin-sidebar.tsx
│   │   └── ui/                     # Radix UI component library
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       ├── checkbox.tsx
│   │       ├── radio-group.tsx
│   │       ├── switch.tsx
│   │       ├── accordion.tsx
│   │       ├── collapsible.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── separator.tsx
│   │       ├── scroll-area.tsx
│   │       ├── skeleton.tsx
│   │       ├── alert.tsx
│   │       ├── badge.tsx
│   │       ├── carousel.tsx
│   │       ├── calendar.tsx
│   │       ├── chart.tsx
│   │       ├── menubar.tsx
│   │       ├── popover.tsx
│   │       ├── slider.tsx
│   │       ├── table.tsx
│   │       ├── tooltip.tsx
│   │       └── and more...
│   │
│   ├── firebase/                    # Firebase Integration
│   │   ├── config.ts               # Firebase config
│   │   ├── client-provider.tsx     # Client-side Firebase
│   │   ├── provider.tsx            # Firebase context provider
│   │   ├── server.ts               # Server-side Firebase Admin
│   │   ├── error-emitter.ts        # Error handling
│   │   ├── errors.ts               # Error types
│   │   ├── index.ts                # Firebase exports
│   │   ├── non-blocking-updates.tsx # Async updates
│   │   ├── firestore/              # Firestore hooks
│   │   │   ├── use-collection.tsx # Firestore collection hook
│   │   │   └── use-doc.tsx        # Firestore document hook
│   │   └── ...
│   │
│   ├── ai/                         # AI/ML Features
│   │   ├── genkit.ts               # Genkit configuration
│   │   ├── dev.ts                  # Development utilities
│   │   └── flows/                  # AI Processing Flows
│   │       ├── contact-form-analysis.ts      # Analyze submissions
│   │       └── contact-form-sentiment-analysis.ts # Sentiment detection
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── use-mobile.tsx          # Mobile detection
│   │   └── use-toast.ts            # Toast notifications
│   │
│   ├── lib/                        # Utilities & Types
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── utils.ts                # Helper functions
│   │   ├── email-actions.ts        # Email operations
│   │   └── placeholder-images.json # Sample image data
│   │
│   └── ...
│
├── docs/
│   └── backend.json                # Backend documentation
│
├── Configuration Files
│   ├── package.json                # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── next.config.js              # Next.js configuration
│   ├── tailwind.config.ts          # Tailwind CSS config
│   ├── postcss.config.mjs          # PostCSS config
│   ├── apphosting.yaml             # Firebase App Hosting config
│   ├── firestore.rules             # Firestore security rules
│   ├── components.json             # Component library metadata
│   └── next-env.d.ts               # Next.js TypeScript definitions
```

---

## 🔧 Configuration & Setup

### **Environment Variables**
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
GOOGLE_GENAI_API_KEY=your-google-genai-api-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```
```
**Setup Instructions:**
1. Create a `.env.local` file in the project root
2. Copy the template above and replace placeholder values
3. Obtain Firebase credentials from Firebase Console
4. Get Google Generative AI key from Google AI Studio
5. Configure reCAPTCHA keys from Google reCAPTCHA Admin Console
```

### **Next.js Configuration**
- **Output Mode:** Standalone (for optimal deployment)
- **ESLint:** Ignored during builds for flexibility
- **Remote Images:** Allow all remote image sources (HTTP/HTTPS)
- **Webpack:** Ignores firestore.rules and backend.json from watch

### **Firebase App Hosting**
- **Max Instances:** 1 (can be scaled up as needed)
- **Runtime:** Node.js via Firebase App Hosting

---

## 📊 Database Schema (Firestore)

### Collections:
1. **configurations**
   - Stores site-wide settings
   - Fields: key (string), value (any)
   - Examples: siteName, heroHeadline, heroSubheadline

2. **contact_form_submissions**
   - Stores visitor contact form submissions
   - Fields: name, email, message, timestamp
   - Used for AI sentiment analysis

3. **users** (implicit via Firebase Auth)
   - User authentication records
   - Email verification status

4. **images** (implied)
   - Gallery image metadata and URLs

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account with Firestore enabled
- Google Generative AI API key (for Genkit features)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Optivista

# Install dependencies
npm install

# Install patches
npm run postinstall
```

### Development

```bash
# Start development server
npm run dev
# Access at http://localhost:3000

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

### Production Build

```bash
# Build for production (includes type checking)
npm run build

# Start production server
npm start
```

---

## 🎨 UI Component Library

The project leverages **Radix UI** primitives with custom Tailwind styling. Available components include:

- Forms: Input, Textarea, Checkbox, Radio Group, Select, Label
- Dialogs & Alerts: Dialog, Alert Dialog, Alert
- Navigation: Sidebar, Menubar, Dropdown Menu
- Display: Card, Badge, Avatar, Carousel, Table, Tabs
- Feedback: Toast, Toaster, Progress
- Layout: Scroll Area, Separator, Collapsible, Accordion
- Media: Image display with watermarking support
- Theme: Dark/Light mode toggle with persistence

---

## 🔐 Security Features

1. **Firebase Authentication:** Secure user login and registration
2. **Firestore Security Rules:** Defined in `firestore.rules`
3. **Email Verification:** Mandatory email verification for new accounts
4. **Admin Protection:** Admin pages protected by authentication checks
5. **Environment Variables:** Sensitive data managed securely

---

## 🤖 AI Integration

### **Genkit Configuration**
- **Model:** Google Gemini 2.5 Flash (latest)
- **Location:** `src/ai/genkit.ts`

### **AI Flows**
Located in `src/ai/flows/`:

1. **Contact Form Analysis**
   - Analyzes incoming contact submissions
   - Extracts insights from visitor messages
   - File: `contact-form-analysis.ts`

2. **Sentiment Analysis**
   - Determines emotional tone of contact messages
   - Classifies sentiment (positive, negative, neutral)
   - File: `contact-form-sentiment-analysis.ts`

### **Non-Blocking AI Processing**
AI operations don't block user interactions - processed asynchronously via Genkit Next.js integration.

---

## 📱 Pages & Routes

| Route | Purpose | Protected |
|-------|---------|-----------|
| `/` | Home page with gallery showcase | No |
| `/contact` | Contact form page | No |
| `/gallery` | Full gallery view | No |
| `/login` | User login | No |
| `/signup` | User registration | No |
| `/verify-email` | Email verification | Yes |
| `/profile` | User profile management | Yes |
| `/admin` | Admin dashboard | Yes |
| `/admin/images` | Image management | Yes |
| `/admin/downloads` | Download management | Yes |
| `/admin/settings` | Site settings | Yes |
| `/privacy-policy` | Legal page | No |
| `/terms-of-service` | Legal page | No |

---

## 🛠️ Development Workflow

### Scripts
```bash
npm run dev        # Start dev server with hot reload
npm run build      # Build for production with type check
npm start          # Start production server
npm run lint       # Run ESLint
npm run typecheck  # TypeScript type validation
npm run postinstall # Apply patches from patch-package
```

### Type Safety
- **Strict Mode:** Enabled in `tsconfig.json`
- **No Implicit Any:** Enforced
- **Type Checking:** Required before build

### Code Quality
- ESLint configured via Next.js
- TypeScript strict mode
- Path aliases for clean imports: `@/*`

---

## 📦 Dependencies Overview

### Core Framework
- `next@15.5.7` - React framework
- `react@18.3.1` - UI library
- `typescript` - Type safety

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `@radix-ui/*` - Accessible component primitives
- `lucide-react` - Icon library
- `class-variance-authority` - Component variants
- `next-themes` - Theme management

### Forms & Validation
- `react-hook-form@7+` - Form state management
- `@hookform/resolvers` - Validation resolvers
- `zod` - Schema validation

### Backend & Data
- `firebase@10.12.2` - Client SDK
- `firebase-admin@12.1.1` - Admin SDK
- `genkit@latest` - AI framework
- `@genkit-ai/google-genai` - Google AI integration
- `@genkit-ai/next` - Next.js integration

### Utilities
- `date-fns` - Date manipulation
- `embla-carousel-react` - Carousel component
- `patch-package` - NPM package patching
- `clsx` - Utility for conditional classes

---

## 🚢 Deployment

### Firebase App Hosting
```yaml
# apphosting.yaml configuration
runConfig:
  maxInstances: 1  # Scale as needed
```

### Build Output
- **Type:** Standalone Next.js application
- **Format:** Optimized for containerization
- **Bundle Size:** Optimized via tree-shaking

### Deployment Steps
1. Build the application: `npm run build`
2. Deploy to Firebase: `firebase deploy --only hosting`
3. Monitor via Firebase Console

---

## 📝 Key Files & Their Purposes

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page with hero section and gallery preview |
| `src/components/contact-form.tsx` | Contact form with Firestore integration |
| `src/firebase/config.ts` | Firebase project configuration |
| `src/ai/genkit.ts` | AI model initialization |
| `src/app/admin/layout.tsx` | Admin dashboard layout with sidebar |
| `firestore.rules` | Firestore access control rules |
| `next.config.js` | Next.js build configuration |
| `tailwind.config.ts` | Tailwind CSS customization |

---

## 🎯 Future Enhancements

- [ ] Payment processing for image purchases
- [ ] Advanced image filtering and search
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Automated email notifications
- [ ] Image optimization pipeline
- [ ] CDN integration
- [ ] Advanced user roles and permissions
- [ ] Real-time notifications
- [ ] Multi-language support

---

## 📄 License & Legal

- Privacy Policy: `/privacy-policy`
- Terms of Service: `/terms-of-service`

---

## 👨‍💻 Development Notes

### Mobile Responsive
- Uses `use-mobile` hook for responsive behavior
- Mobile-first CSS approach with Tailwind
- Touch-friendly UI components

### Error Handling
- Firebase error listener component
- Non-blocking error emitter system
- User-friendly error messages via toasts

### Performance Optimizations
- Next.js image optimization
- Server-side rendering for SEO
- Client-side hydration with Firebase
- Standalone build for faster deployment

---

## 🤝 Contributing

When contributing to this project:
1. Follow TypeScript strict mode
2. Use component-based architecture
3. Add appropriate type definitions
4. Test responsive behavior
5. Update README for significant changes

---

## 📞 Support & Contact

For inquiries or issues, use the contact form at `/contact` on the live website.

---

**Last Updated:** December 2025  
**Project Status:** 🚀 Active Development
