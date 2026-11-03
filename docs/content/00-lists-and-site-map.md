# 00 · The lists: modules, integrations and every URL

_Written 2026-10-29. Source: the site's own data and a crawl of the running site. This is the reference for all the content in this folder._

## 1. The 14 modules

The count plan is fixed: **14 modules and 5 integrations**. AI Secretary is the fourteenth module. Reports & Analytics and the Parent, Teacher and Management apps are **included with every plan** and are not counted in the 14.

| # | Module | Area | Page today | Its promise, in one line |
|---|--------|------|------------|--------------------------|
| 1 | Admissions Management | Admissions and students | `/features/admissions` | From enquiry to enrolment, fully online. |
| 2 | Student Management | Admissions and students | `/features/student` | Every student's full record, one click away. |
| 3 | Staff Management | People and communication | `/features/staff-hr` | Manage your whole team from one place. |
| 4 | Fee Management | Fees and finance | `/features/fees` | Collect fees on time, every time. |
| 5 | AI Powered Timetable & Scheduling | Teaching and academics | `/features/timetable` | Conflict-free timetables, instant substitutions. |
| 6 | Attendance Management | Teaching and academics | `/features/attendance` | Mark, track and notify in seconds. |
| 7 | Academic & Examination | Teaching and academics | `/features/exams` | From exam schedules to report cards, automated. |
| 8 | Communication Management | People and communication | `/features/whatsapp` | Reach every parent: WhatsApp, SMS and voice. |
| 9 | Academic Inventory Tracking | Campus operations | `/features/inventory` | Track every academic asset in real time. |
| 10 | Payroll Management | Fees and finance | `/features/payroll` (own page since 2026-10-29) | Salaries with PF, ESI and TDS, zero manual errors. |
| 11 | Library Management | Teaching and academics | `/features/library` | A modern, digital, organised library. |
| 12 | Transport Management | Campus operations | `/features/transport` | Track every bus in real time. |
| 13 | Inspace Performance Insights | Insight and AI | `/features/performance-insights` | Deep, school-wide analytics. |
| 14 | AI Secretary | Insight and AI | `/features/ai-secretary` | Ask in plain language, get answers from your school's data. |

**URL notes.** Payroll Management now has its own page, `/features/payroll`, so "school payroll software" has a page to rank. Communication Management still lives at `/features/whatsapp`; the name and the URL should agree (keep the URL and add a redirect if you rename).

## 2. The 5 integrations

| # | Integration | What it does for the school | Modules it touches |
|---|-------------|-----------------------------|--------------------|
| 1 | Biometric and RFID attendance | Marks attendance from the devices you already own | Attendance, Payroll |
| 2 | GPS fleet tracking | Shows every bus live and alerts parents at each stop | Transport, Parent app |
| 3 | Tally ERP | Connects fee and finance data to your accounts | Fee Management (Payroll: **[confirm]**) |
| 4 | Online payment gateway (Razorpay named) | Lets parents pay fees at any time, with duplicate-proof reconciliation | Fee Management |
| 5 | WhatsApp Business API (with SMS and voice) | Sends notices, reminders and alerts with delivery and read receipts | Communication, Fees, Attendance, Transport |

Facts to confirm before the integrations get their own page: supported biometric and RFID brands, other payment gateways, whether the Tally sync is one-way or two-way, supported GPS hardware, and whether customers get an API.

## 3. Every URL: 62 public pages, 3 technical files, 4 internal pages

### Public pages (61)

| Group | Count | URLs |
|-------|-------|------|
| Home | 1 | `/` |
| Main pages | 8 | `/product`, `/pricing`, `/platform-capabilities`, `/compare`, `/about`, `/security`, `/contact`, `/managed-it-services` |
| Search landing pages | 2 | `/school-erp-tamil-nadu`, `/school-erp-chennai` |
| Ads landing page (not indexed) | 1 | `/lp/school-erp-tamil-nadu` |
| Module and feature pages | 16 | `/features/` admissions, student, staff-hr, payroll, fees, timetable, attendance, exams, whatsapp, inventory, library, transport, performance-insights, ai-secretary, parent-app, reports |
| Board pages | 6 | `/solutions/` state-cbse, matric, ib, cambridge, montessori, pre-school |
| Role pages | 8 | `/solutions/role/` school-owners, principals, teachers, parents, accountants, administrators, coordinator, transport-incharge |
| Resource hubs | 6 | `/blog`, `/case-studies`, `/news`, `/webinars`, `/help`, `/release-notes` |
| Posts | 11 | 4 blog posts, 2 case studies, 3 news articles, 2 webinars |
| Company and legal | 3 | `/about` is in main pages; `/careers`, `/privacy`, `/terms` |

_(Counts: 1 + 8 + 2 + 1 + 16 + 6 + 8 + 6 + 11 + 3 = 62.)_

### Technical files (3) and internal pages (4)

- **Technical:** `/sitemap.xml`, `/robots.txt`, `/llms.txt`. These are for search engines and AI crawlers.
- **Internal, not for visitors:** `/admin`, `/auth/login`, `/preview-home`, `/preview-heroes`. Remove the two previews before launch.

### Recommended new pages (to show the whole ERP without opening it)

| New URL | Why |
|---------|-----|
| ~~`/features/payroll`~~ | **Done 2026-10-29:** Payroll split from Staff |
| `/integrations` | One page for the five integrations and what each connects |
| `/product-tour` | A guided walk through a school day, with screenshots using dummy data |
| `/how-it-works` | The three steps (demo, setup and migration, go live) in detail |
| `/school-erp-coimbatore`, `-madurai`, `-trichy`, `-salem` | City pages for the ads plan |

## 4. How a visitor moves through the site (no dead ends)

The rule: **every page ends with the next logical step.** Nobody should reach a page and have nowhere to go.

```
Home
 ├─ "See what it runs"  → Modules hub (/product)
 │     └─ a module page → its neighbours in the same area → the next area
 │           └─ "Works with" → integration → back to the module
 ├─ "Is it for my school?" → Board page → Role page
 ├─ "Can I trust it?"      → Case study / Security / About
 ├─ "What does it cost?"   → Pricing → Compare
 └─ "Show me"              → Book a demo / Chat on WhatsApp (on every page)
```

Each module page ends with three links: **the module that comes next in the school day, the module it works with, and the demo.**

## 5. The content plan, in stages

| Stage | Pages | Status |
|-------|-------|--------|
| 1 | The 14 module pages, with the 5 integrations woven in | **Written, in `01-module-content.md`** |
| 2 | Home page and the main pages (product, pricing, compare, about, security, contact, platform capabilities) | Next |
| 3 | The 6 board pages, 8 role pages and the Tamil Nadu and Chennai pages | After stage 2 |
| 4 | Resource hubs and the 11 posts | After stage 3 |
| 5 | New pages: payroll, integrations, product tour, how it works, city pages | After the company confirms the facts |

## 6. The "see the ERP without opening it" pattern

Every module page carries the same block, **"Open it and you'll see"**: six concrete things the module gives you, written as what you'll do and get, followed by a place for a real screenshot with dummy data. The aim is that a principal who reads three module pages feels they have already used the system. Screenshots are the missing ingredient; each page has a marked slot.
