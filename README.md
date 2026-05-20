# recovly

**Automated Campus Property Recovery Management System**

A web-based platform for reporting, tracking, and recovering lost items within a university campus environment. Built with Next.js 14, TypeScript, PostgreSQL, and deployed on Vercel.

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend    | Next.js API Routes (Node.js)                        |
| Database   | PostgreSQL via Neon                                 |
| ORM        | Prisma                                              |
| Auth       | NextAuth.js                                         |
| Validation | Zod                                                 |
| Deployment | Vercel                                              |

---

## Getting Started

### 1. Clone and install
```bash
git clone <repo>
cd recovly
pnpm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Fill in your Neon DATABASE_URL and NEXTAUTH_SECRET
```

### 3. Generate Prisma client and push schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Run development server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
recovly/
│
├── .env.example                  # Environment variable template
├── .env                          # Your local env values (git ignored)
├── README.md
├── tailwind.config.ts            # Tailwind wired to CSS variables
├── tsconfig.json                 # Strict TypeScript config
├── package.json
│
├── prisma/
│   └── schema.prisma             # Complete database schema
│
├── app/                          # Next.js App Router
│   ├── globals.css               # CSS variable injections, base styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   │
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/              # Protected route group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── report-lost/
│   │   │   └── page.tsx
│   │   ├── report-found/
│   │   │   └── page.tsx
│   │   ├── my-items/
│   │   │   └── page.tsx
│   │   └── notifications/
│   │       └── page.tsx
│   │
│   ├── (admin)/                  # Admin-only route group
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── users/
│   │       │   └── page.tsx
│   │       ├── items/
│   │       │   └── page.tsx
│   │       ├── claims/
│   │       │   └── page.tsx
│   │       └── reports/
│   │           └── page.tsx
│   │
│   └── api/                      # API route handlers
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts
│       ├── lost-items/
│       │   └── route.ts
│       ├── found-items/
│       │   └── route.ts
│       ├── matches/
│       │   └── route.ts
│       ├── claims/
│       │   └── route.ts
│       ├── notifications/
│       │   └── route.ts
│       └── admin/
│           └── route.ts
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Base design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ThemeToggle.tsx
│   └── forms/                    # Feature-specific forms
│       ├── LostItemForm.tsx
│       ├── FoundItemForm.tsx
│       └── ClaimForm.tsx
│
└── lib/                          # Utilities and core logic
    ├── design-system.ts          # Single source of truth for design tokens
    ├── matching.ts               # Rule-based item matching engine
    ├── validations.ts            # Zod schemas for all inputs
    ├── prisma.ts                 # Prisma client singleton
    ├── env.ts                    # Typed environment variable validation
    └── cn.ts                     # Tailwind class merging utility

types/                            # Global TypeScript types
    ├── index.ts                  # All shared application types
    └── prisma.ts                 # Prisma model type stubs
```

---

## System Modules

| Module             | Responsibility                                              |
|--------------------|-------------------------------------------------------------|
| User Module        | Registration, login, authentication, session management     |
| Lost Item Module   | Report, store, search, and update lost items                |
| Found Item Module  | Record, store, and manage found items                       |
| Matching Module    | Rule-based scoring engine — compares lost vs found items    |
| Notification Module| In-app and email alerts on matches, claims, and updates     |
| Admin Module       | Claims verification, user management, reports               |

---

## Matching Algorithm

The matching engine scores lost vs found item pairs across five dimensions:

| Field       | Weight | Logic                                      |
|-------------|--------|--------------------------------------------|
| Name        | 40pts  | Exact, contains, or Jaccard token overlap  |
| Description | 30pts  | Jaccard keyword similarity                 |
| Color       | 15pts  | Exact or partial match, neutral if unknown |
| Location    | 10pts  | Exact, contains, or token overlap          |
| Date        | 5pts   | Proximity decay — max 7 day window         |

**Threshold:** A pair scoring **60 or above** is surfaced as a match candidate.

| Score   | Confidence Label |
|---------|-----------------|
| 80–100  | Strong Match    |
| 60–79   | Possible Match  |
| Below 60| Not surfaced    |

---

## Design System

All design tokens live in `lib/design-system.ts` — the single source of truth.

- No hardcoded color values anywhere in the codebase
- All colors are CSS variables consumed by Tailwind
- Light and dark mode handled via `[data-theme="dark"]` on the root element
- Color palette: cream/carton base + burnt orange-red, steel blue, forest green accents
- Rule of thirds grid layout system
- Minimalistic, bold, creamy aesthetic

---

## Database Schema

Six models — Users, LostItems, FoundItems, Matches, Claims, Notifications.
See `prisma/schema.prisma` for full detail.

---

## Environment Variables

| Variable               | Required | Description                          |
|------------------------|----------|--------------------------------------|
| `DATABASE_URL`         | Yes      | Neon PostgreSQL connection string    |
| `NEXTAUTH_SECRET`      | Yes      | Min 32 char secret for NextAuth      |
| `NEXTAUTH_URL`         | Yes      | Base URL of the app                  |
| `SMTP_HOST`            | No       | Email server host                    |
| `SMTP_PORT`            | No       | Email server port                    |
| `SMTP_USER`            | No       | Email server username                |
| `SMTP_PASSWORD`        | No       | Email server password                |
| `SMTP_FROM`            | No       | From address for outgoing emails     |
| `CLOUDINARY_CLOUD_NAME`| No       | Cloudinary for image uploads         |
| `CLOUDINARY_API_KEY`   | No       | Cloudinary API key                   |
| `CLOUDINARY_API_SECRET`| No       | Cloudinary API secret                |

---

## Deployment

### Vercel (recommended)
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Database (Neon)
1. Create a project on [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Run `npx prisma db push` to apply schema

---

## Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
npx prisma studio    # Open Prisma database GUI
npx prisma db push   # Push schema to database
npx prisma generate  # Generate Prisma client
```