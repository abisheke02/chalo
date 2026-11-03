# 08 · Content strategy: modules, automation and integrations

_Written 2026-10-29. This is a plan, not yet built. It uses only facts already published on the site; anything not yet confirmed is marked **[confirm]**._

> **Scope update (2026-10-29):** the Automation page (section 7), the "day at a school" story and the "What runs by itself" home block are **out of scope for now**. Keep the "what it does by itself" row in the module template only if the company wants it. The module grouping, module pages, Integrations page and home reorder stay.

## 0. Decisions confirmed on 2026-10-29

| Topic | Decision |
|-------|----------|
| Module count | **14 modules**: 8 core + 6 add-ons, exactly the groups in the site menu |
| Integrations | **5**: Biometric attendance, GPS fleet tracking, Tally ERP, online payment gateway, WhatsApp |
| The old "19+" | It was 14 modules + 5 integrations = **19**. Always word it "modules and integrations", never "19 modules" |
| Not counted in the 14 | Reports & Analytics and the Parent, Teacher and Management apps. They are included with every plan |
| Missing module pages | Built: Student Management, Academic Inventory, Performance Insights, AI Secretary (all features live) |
| Managed IT services | Own page at `/managed-it-services`; removed from the home page, one link left |
| Contact | Phone +91 99622 28160, WhatsApp 919962228160, new leads to enquiry@chaloschools.com |

### The count plan (where each number comes from and how to write it)

| Say | When | Source |
|-----|------|--------|
| "14 modules" | Headlines, hero, menus, About, board pages | `site.modulesCount` |
| "5 integrations" | The integrations strip and page | `site.integrationsCount` |
| "14 modules and 5 integrations (19 in all)" | Only where a combined figure is useful | `site.modulesAndIntegrationsCount` |
| "Reports & Analytics and the apps are included" | Anywhere the 14 is explained | text |

Rules: change the numbers only in `src/config/site.ts`; never type a number into a page by hand; never write "19+ modules" or "16 modules". Places already aligned: About page, State and CBSE board stats, chatbot answers, `llms.txt`. The Product page still lists 16 entries (14 modules plus Reports & Analytics and the Parent App), so label those two as "included with every plan" when the page is next edited.

## 1. The goal

A school owner, principal or correspondent should understand within a minute:

1. **What it runs** — which parts of the school Chalo covers.
2. **What it does by itself** — the follow-ups, reminders and reports nobody has to chase.
3. **What it connects to** — the devices, accounts and messaging the school already uses.
4. **What it costs and how long it takes** to get going.

The site should work as a decision tool, not a brochure. Every page answers one question a buyer actually asks.

## 2. What is wrong today (evidence from the site)

| Problem | Where |
|---------|-------|
| Modules appear as a **flat list of names** (14 on the homepage, 16 on the Product page, "core" and "add-on" groups that mean nothing to a buyer). | Home, `/product` |
| **Automation has no page.** It appears as scattered bullets ("Automated fee reminders…") inside module lists. The best material (`20+ AI capabilities`) is a feature list, not an explanation of what happens automatically. | `/platform-capabilities` |
| **Integrations are five chips** (Biometric, GPS, Tally, Payment Gateway, WhatsApp) with no explanation of what each does or how it connects. "API-first design with third-party connectors" is claimed once with no detail. | `/product` |
| **4 modules have no page of their own**: Student Management, Academic Inventory, Performance Insights and **AI Secretary** (the main differentiator). They only open a panel on `/product`. | `module-links.ts` |
| The home page spends a large block on **Managed IT Services** (CCTV, network, helpdesk), which confuses a school ERP buyer. | Home, "Why choose us" |
| Nothing says **Tamil Nadu or Chennai** on the home page. | Home |
| Words like "ERP", "AI-powered" and "industry-first" are used without an example. | Several pages |

## 3. Who reads it and what they ask

| Reader | Decides | Their questions |
|--------|---------|-----------------|
| Owner / correspondent / trustee | Buy or not | What will it change? What does it cost? Can I trust the company? |
| Principal | Day-to-day fit | Will teachers use it? Will it cut my admin work? Does it handle my board? |
| Accountant | Fees and payroll | Does it work with Tally? Receipts? PF, ESI, TDS? |
| IT / administrator | Setup | Does it work with our biometric and bus devices? Is the data safe? Who migrates data? |
| Parent (indirect) | Adoption | Is the app simple? Will I get alerts? |

## 4. Writing rules

1. **Lead with the outcome, then the feature.** "Fees reach you on time" before "multi-instalment plans".
2. **One idea per section, one sentence per idea.** Short lines. No paragraph over three sentences.
3. **Say what happens, who gets it, and when.** "When a student is marked absent, the parent gets a WhatsApp or SMS message straight away."
4. **Name the thing.** Replace "AI-powered" with what it does ("builds a conflict-free timetable").
5. **Explain "ERP" once**, on first use: "one system that runs admissions, fees, attendance, exams and more".
6. **Numbers only if real.** Sample figures must be labelled "sample". Use one source (`src/config/site.ts`) for counts.
7. **Same words everywhere.** One name per module, one count, one grouping.
8. **Show it.** Use the existing 3D scenes, the module scroll and short before/after pairs, not stock photos.
9. **Every page ends with the next step**: book a demo, or open the related module.
10. **Tamil Nadu and board specifics sit next to the feature they belong to**, never as a separate vague claim.

## 5. A better way to group the modules

Replace "core and add-on" with six areas a school understands. This also removes the 14 versus 16 confusion, because the count is just the number of modules in the data.

| Area | Question it answers | Modules |
|------|---------------------|---------|
| **Admissions and students** | Who is joining and who do we have? | Admissions · Student Management |
| **Fees and finance** | Is money coming in and going out correctly? | Fee Management · Payroll Management |
| **Teaching and academics** | Is the school running smoothly day to day? | AI Timetable & Scheduling · Attendance · Academic & Examination · Library |
| **People and communication** | Is everyone informed? | Staff Management · Communication · Parent & Student App |
| **Campus operations** | Are buses and assets under control? | Transport · Academic Inventory Tracking |
| **Insight and AI** | What is happening, and what should we do? | Reports & Analytics · Performance Insights · AI Secretary |

With the confirmed count this is **14 modules in 6 areas** (the six areas below are the same, without Reports & Analytics and the Parent App). Those two, and the three apps, are listed once as "included with every plan".

## 6. Module page template (all 16 modules)

Every module gets its own page, `/features/<module>`, built to the same template so buyers learn the pattern.

| Block | Content | Example length |
|-------|---------|----------------|
| 1. Headline | The outcome in plain words | 1 line |
| 2. Before and after | "Today: … With Chalo: …" | 2 short columns |
| 3. What it does | 4–6 features, one line each | 6 bullets |
| 4. **What it does by itself** | Trigger, action, who gets it (see section 7) | 3–6 rows |
| 5. **What it connects to** | Devices, accounts, messaging for this module | 1–4 chips with a line each |
| 6. Who uses it | Role and what they see | 3 rows |
| 7. Board and state notes | CBSE, State Board, Matriculation specifics | Only if confirmed |
| 8. Related modules | Links to modules it works with | 3 links |
| 9. FAQs (with FAQ schema) | 4–6 real questions | |
| 10. Call to action | Book a demo | |

### Worked example: Fee Management (facts only from the current site)

**Headline:** Collect fees on time, without chasing parents.

**Today → With Chalo:** Fee follow-ups are done by hand and receipts are matched in spreadsheets → Reminders go out by themselves, parents pay online, and every receipt is reconciled.

**What it does**
- Multi-instalment fee plans with custom due dates
- Concessions and scholarships
- Transport, hostel and activity fees
- Online payment and counter payments
- GST-ready receipts and detailed financial reports
- Live view of collection and pending dues

**What it does by itself**

| When | Chalo does | Who gets it |
|------|-----------|-------------|
| A due date approaches or passes | Sends reminders by SMS and WhatsApp until the fee is paid | Parent |
| A parent pays online | Records the payment, issues the receipt, updates the ledger | Parent, accounts |
| The day ends | Reconciles payments against student IDs | Accountant |
| Dues stay open | Flags defaulters in real time | Principal, accounts |

**What it connects to:** online payment gateway (Razorpay and others **[confirm full list]**), Tally ERP, WhatsApp Business API, SMS.

## 7. New page: "Automation" (`/automation`)

**Purpose:** answer "what will my staff stop doing?" Group by module, show trigger → action → who. The first draft below uses only items already published on the site.

| Module | Trigger | Chalo does it automatically | Who gains |
|--------|---------|------------------------------|-----------|
| Admissions | New enquiry or application | Sends SMS/WhatsApp status updates and follow-ups; tracks enquiry to enrolment | Office, parents |
| Admissions | New academic year | Processes admissions in bulk | Office |
| Student | Year ends | Promotes students to the next class in bulk | Office |
| Fees | Due date | Sends fee reminders by SMS and WhatsApp | Parents, accounts |
| Fees | Payment received | Issues receipt, updates ledger, reconciles daily | Accounts |
| Attendance | Student marked absent | Notifies the parent at once | Parents |
| Attendance | Biometric or RFID scan | Marks attendance without manual entry | Teachers |
| Attendance | Staff leave request | Routes it for approval | Admin |
| Timetable | Setup | Builds a conflict-free timetable around teachers and rooms | Coordinator |
| Timetable | Teacher absent | Assigns a substitute instantly | Coordinator |
| Exams | Marks entered | Calculates grades and generates report cards in board format | Teachers |
| Exams | Results ready | Publishes results online to parents | Parents |
| Communication | Event or notice | Sends WhatsApp, SMS and voice, and tracks delivery and reads | Office |
| Reports | Schedule | Emails reports to stakeholders on a schedule | Management |
| Inventory | Stock low | Raises low-stock alerts and reorder reminders | Store |
| Payroll | Month end | Calculates salaries with PF, ESI and TDS; produces payslips and bank-ready files | Accounts, staff |
| Library | Due date | Sends due-date reminders; tracks fines | Students, librarian |
| Transport | Bus reaches a stop | Alerts parents at pickup and drop | Parents |
| Performance Insights | Data changes | Flags at-risk students and early warnings | Principal |
| AI Secretary | Daily or weekly | Sends summary briefings and alerts on unusual changes such as an attendance drop | Management |
| AI Secretary | Any time | Answers plain-language questions on school data; drafts notices and circulars **[confirm drafting is live]** | Management |

**Layout idea: "A day at a school on Chalo."** A scroll story, in time order, that shows each automation firing: 8:30 attendance is marked and a parent is alerted → 9:00 a teacher is absent and a substitute is assigned → 11:00 a fee reminder goes out → 2:00 a parent pays and the receipt arrives → 3:30 the bus reaches a stop and parents are notified → 5:00 the principal's summary lands. It reuses the scroll and scene work already built.

## 8. New page: "Integrations" (`/integrations`)

**Purpose:** answer "does it work with what we already use?" Group by what the school does, not by logo.

| Group | What | Confirmed on the site |
|-------|------|----------------------|
| **Attendance devices** | Biometric and RFID machines | "Works with your existing devices" |
| **Scanners** | Barcode and QR for library and inventory | Yes |
| **Transport** | GPS fleet tracking, live bus location in the parent app | Yes |
| **Accounting** | Tally ERP | Yes (direction of sync **[confirm]**) |
| **Payments** | Online payment gateway (Razorpay named), 24/7 fee payments, duplicate-proof, bank-synced reconciliation | Yes (other gateways **[confirm]**) |
| **Messaging** | WhatsApp Business API, SMS, voice broadcast | Yes |
| **Payroll and banks** | Bank-ready payment files | Yes |
| **Data in and out** | Excel, PDF and CSV export; data migration included at onboarding; timetable to digital display boards | Yes |
| **Open platform** | "API-first design with third-party connectors built in" | Claimed; **[confirm** whether an API and documentation are available to customers**]** |

**Open questions the page must answer once confirmed:** which biometric and RFID brands work, which payment gateways, which GPS hardware, whether Tally sync is one-way or two-way, whether UDISE or EMIS export exists (Tamil Nadu), whether there is a public API, how long each integration takes to set up.

## 9. Home page: proposed flow

Keep the existing look and animation. Change the order and the words.

| # | Block | Message | Notes |
|---|-------|---------|-------|
| 1 | Hero | "Your entire school. One platform." Add one line: "Admissions, fees, attendance, exams, timetables, payroll and transport in one system, with the follow-ups done for you." Add "Built in Chennai for schools across Tamil Nadu." | Keep the 3D campus |
| 2 | Proof strip | 200+ schools · 1.5M+ students · ISO 27001:2022 | Numbers from `site.ts` |
| 3 | **What you run** | The 6 areas (section 5), each opening its modules | Replaces the flat list; reuse the horizontal module scroll, grouped |
| 4 | **What runs by itself** | "A day at a school on Chalo" with 4–6 automations | Links to `/automation` |
| 5 | **What it connects to** | Devices, Tally, payments, WhatsApp as a hub diagram | Links to `/integrations` |
| 6 | Apps for every role | Parent, teacher, management | Keep |
| 7 | Every board | CBSE, State Board, Matriculation, IB, Cambridge, Montessori | Add Tamil Nadu line when confirmed |
| 8 | Proof | Testimonials and case studies (DAV Schools, Air Force School Chennai) | Move up; trust sells |
| 9 | Security | DPDP and ISO 27001 | Keep short |
| 10 | Pricing | Per student, per year; free onboarding | Add price once confirmed |
| 11 | Live in three steps | Demo, migration, go live | Keep |
| 12 | FAQ | 6–8 questions, including "Does it work with Tally and our biometric devices?" | Keep FAQ schema |
| 13 | Final call to action | Book a demo | |

**Remove from the home page:** the Managed IT Services block. Move it to its own page or a footer link; it serves a different buyer.

## 10. Visual treatment

- **Modules:** keep one 3D scene per module (already built) and the horizontal scroll, grouped under the six areas.
- **Automation:** animated trigger → action → result cards. Reduced-motion users see them as plain steps.
- **Integrations:** a hub-and-spoke diagram with the school at the centre.
- **Everywhere:** one idea per screen, short lines, real product screenshots with dummy data (Q5.2).

## 11. SEO and AI answers

Each block above is also a search answer.

| Page | Searches it serves |
|------|--------------------|
| Module pages | "school fee management software", "ai timetable generator for schools", "school bus tracking app" |
| `/automation` | "school automation software", "automatic fee reminder software for schools" |
| `/integrations` | "school erp with tally integration", "school software with biometric attendance" |
| Home and regional pages | "school erp tamil nadu", "school erp chennai" |

Each page opens with a one-sentence answer and carries FAQ schema, so AI tools can quote it (see `02-ai-visibility-geo.md`).

## 12. Facts to confirm before building

| # | Question | For |
|---|----------|-----|
| 1 | Which biometric and RFID devices are supported? | Integrations |
| 2 | Which payment gateways beyond Razorpay? | Integrations |
| 3 | Is Tally sync one-way or two-way? | Integrations, Fees |
| 4 | Is there an API with documentation for customers? | Integrations |
| 5 | Which GPS hardware vendors work? | Transport |
| 6 | Is notice and circular drafting by AI Secretary live today? | Automation |
| 7 | Are UDISE and EMIS exports supported? | Tamil Nadu pages |
| 8 | Official module count and grouping | All pages |
| 9 | Product screenshots with dummy data | Visuals |
| 10 | Is Managed IT Services a separate business to promote elsewhere? | Home |

## 13. Build order

| Step | Work | Needs company? |
|------|------|----------------|
| 1 | Module data: add the six areas and the "what it does by itself" and "connects to" fields for each module | No (uses published facts) |
| 2 | Module page template, then roll out to all 16, including the 4 missing pages (Student, Inventory, Performance Insights, **AI Secretary**) | No for structure; copy review |
| 3 | `/automation` page and the "day at a school" scroll story | Item 6 above |
| 4 | `/integrations` page | Items 1–5 above |
| 5 | Home page reorder, remove Managed IT block, add Tamil Nadu line | Item 8 |
| 6 | Navigation: add Automation and Integrations; group Modules by area | No |

Steps 1, 2 and 6 can start now.
