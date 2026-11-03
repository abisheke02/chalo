# 11 · Home page fix plan (UI, content, module details)

_Written 2026-10-29. **Status: rounds 1 to 3 built (see the status table at the end); round 4 needs a real phone.** Wording is a draft for approval. Facts come from the site itself; anything unconfirmed is marked **[confirm]**._

## What changed since the first review

You switched on testimonials, the case study, social proof, the FAQ and the blog strip. The trust gap is therefore partly closed (five real testimonials, the Air Force School case study). Two testimonials show only a job title as the name ("Chairman", "Correspondent").

## The plan, in four rounds

Each round can be approved, built and checked on its own. After each round the page is re-checked (visible text, links, one H1, all pages 200) and the change log is updated.

### Round 1 · First screen: say who it is for and why to trust it

| # | Fix | Today | Proposed |
|---|-----|-------|----------|
| 1.1 | Hero headline | "Your entire school. One platform." | Keep the line (it tests well and is already in the language files), add a clearer line under it that states the outcome and the place |
| 1.2 | Hero subline | "Admissions, fees, attendance, examinations and parent communication, managed in one secure system." | "Collect fees on time, mark attendance in one tap and keep every parent informed. Built in Chennai for schools across Tamil Nadu and India." |
| 1.3 | Proof beside the button | "200+ schools" is in a band further down | A small line under the buttons: "Used by 200+ schools · ISO 27001:2022 certified" |
| 1.4 | A softer next step | Only "Book a Demo" and "Explore Modules" | Add "Chat on WhatsApp" beside them (the number already exists); add "Watch the 2-minute tour" only if a video is supplied |
| 1.5 | Stats band | "200+ Schools", "1.5+ Million Students", "**4 Countries**", "**99.9% Platform Uptime**" | Replace "4 Countries" with a fact that fits an India-first product, such as "14 Modules" or "6 Boards supported"; keep 99.9% only if confirmed **[confirm]** |
| 1.6 | Testimonial names | "Chairman", "Correspondent" as the person's name | Add the real names (Admin > Testimonials) **[confirm]** |

### Round 2 · Content that explains: modules, apps, pricing

| # | Fix | Today | Proposed |
|---|-----|-------|----------|
| 2.1 | Module section | A 3D carousel plus 14 text links | Keep the carousel, add a **grouped list under it** (six areas, below) so a visitor sees everything the school runs in one glance |
| 2.2 | App names | Headings "Chaloschools", "AnsApp", "C-365" | "Parent & Student App", "Teacher App", "Management App", each with the product name in small text beneath |
| 2.3 | Pricing teaser | Plan names, no figure | One line: "Priced per student, per year. Free onboarding, data migration and training." Add "from ₹X" once the company confirms **[confirm]** |
| 2.4 | FAQ | Five to six generic questions | Make sure it answers cost, data migration, training time, data security and Tamil Nadu boards (Admin > FAQs) |
| 2.5 | Board section | One visible tab (CBSE and State Board) | Check the other boards are reachable on the page; add Matriculation, since it matters in Tamil Nadu |

### Round 3 · Module details (the six areas)

Group the 14 modules by what a school is trying to do. Every module still links to its own page.

| Area | What it answers | Modules | One-line promise |
|------|-----------------|---------|------------------|
| Admissions and students | Who is joining, who do we have? | Admissions · Student Management | From enquiry to enrolment, one record per student |
| Fees and finance | Is money coming in correctly? | Fee Management · Payroll | Fees collected on time, salaries run without errors |
| Teaching and academics | Is the school running smoothly? | AI Timetable · Attendance · Academic & Examination · Library | Timetables, attendance and results without spreadsheets |
| People and communication | Is everyone informed? | Staff Management · Communication | Staff records and parent messages in one place |
| Campus operations | Are buses and assets under control? | Transport · Academic Inventory | Live bus tracking and stock that never runs out |
| Insight and AI | What is happening, what next? | Performance Insights · AI Secretary | Ask a question, get an answer from your own school data |

Included with every plan (not counted in the 14): Reports & Analytics and the Parent, Teacher and Management apps.

Each module page already has its headline, features and FAQs. To finish the "module details" work:

| # | Fix | Detail |
|---|-----|--------|
| 3.1 | Same template on all 15 module pages | Add "who uses it" and "works with" blocks to the 11 older pages (the 4 new ones follow the template already) |
| 3.2 | Longer module pages | Bring each from about 260 words to about 500, using only published facts |
| 3.3 | Integrations strip | Keep the five integrations (biometric, GPS, Tally, payment gateway, WhatsApp) and say in one line what each does |
| 3.4 | Module cards in the carousel | Show a one-line benefit on each card, taken from the module's headline features |

### Round 4 · UI polish and phones

| # | Fix | Detail |
|---|-----|--------|
| 4.1 | Check on a phone | Hero height, button sizes (44 px minimum), carousel scaled size, pill header turning into the menu |
| 4.2 | Keep the page from feeling long | With the five sections now on, the page is about 1,700 words; consider hiding the blog strip or trimming the process steps if it drags |
| 4.3 | Speed | Test the 3D scenes on a mid-range phone; load them only when scrolled into view |
| 4.4 | Motion | Keep the progress bar and hero drift only if they feel right; both switch off for reduced-motion visitors |
| 4.5 | Consistent buttons | One primary style (filled blue), one secondary (outline); one "Book a Demo" in the header, one in the hero, one at the end |

## Order and effort

| Round | Effort | Needs from you |
|-------|--------|----------------|
| 1 | Small (copy, one extra button, one stat) | Approve wording; confirm "Countries" and 99.9%; testimonial names |
| 2 | Small to medium | App naming approval; price (optional); FAQ review |
| 3 | Medium (grouped list, 11 pages extended) | Approval of the six areas; screenshots with dummy data help |
| 4 | Small | A phone to test on |

## How each round is checked

1. Text-diff of the home page before and after, so only the intended lines change.
2. All 61 pages respond; one H1 per page; no broken characters.
3. Title, description and schema re-audited.
4. Phone-width check of the changed sections.
5. Change log updated in `docs/seo/README.md`; every redesign keeps a revert copy.

## Facts to confirm before building

| # | Question |
|---|----------|
| 1 | Is "4 Countries" accurate? If so, which? Or replace it |
| 2 | Is 99.9% uptime backed by a measurement? |
| 3 | Real names for the two testimonials shown as "Chairman" and "Correspondent" |
| 4 | Price per student, or "no price" |
| 5 | Is there a 2-minute tour video? |
| 6 | Approve the six module areas and the new app names |

## Status after building (2026-10-29)

| Item | Status |
|------|--------|
| 1.1 Headline | Kept as is (clear and already translated) |
| 1.2 Subline | **Done** (English; Hindi text unchanged) |
| 1.3 Proof under the buttons | **Done** |
| 1.4 WhatsApp option | **Done**. Tour-video button not added (no video supplied) |
| 1.5 Stats band | **Done**: 14 Modules and 5 Integrations replace Countries and 99.9% uptime. Live site: change in Admin > Site Content |
| 1.6 Testimonial names | **Waiting on you**: "Chairman" and "Correspondent" need real names (Admin > Testimonials) |
| 2.1 Grouped modules | **Done** (see 3 below) |
| 2.2 App names | **Done** |
| 2.3 Pricing | **Done** (included-with-every-plan line). Price line appears when `priceFrom` is set in `site.ts` |
| 2.4 FAQ | Six real questions cover price, migration, security, boards and support. **Training is not covered**: add one question in Admin > FAQs |
| 2.5 Boards | **Not needed**: all five boards, including Matriculation, already have tabs |
| 3.1 Module template | Part done: every module page now has "Part of ... / Works with ..." links. Longer copy for the 11 older pages needs reviewed text, not invented text |
| 3.3 Integrations | **Done** (one sentence) |
| 3.4 Carousel card benefit | Not changed: the card is too small for a sentence |
| 4 Phone, speed, buttons | **Not done**: needs a real device. Please check the home page on a phone and tell me what looks wrong |
