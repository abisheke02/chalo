# 02 · AI visibility (GEO)

_Last updated 2026-10-29. "GEO" = being named and quoted in AI answers (Google AI Overviews, ChatGPT, Perplexity, Copilot). Search results below come from the plan document (checked from a browser in Chennai on 2026-10-29) and were not re-run here._

## Where Chalo stands

- **Brand searches** ("chalo schools", "chalo schools erp"): Google's AI Overview describes Chalo accurately (Inspace Edu Solutions, ISO 27001:2022, AI timetable, Tally integration, parent app, boards supported).
- **Category searches** (school erp tamilnadu, school erp chennai, school management software tamil nadu, school erp software, school fee management software): Chalo is **not named** in the AI Overview for any of the 5. Vidyalaya School Software is named in 4 of 5.
- **Why competitors get named:** they state concrete facts in plain sentences (client counts, EMIS, Tamil language, price) and appear on third-party list sites.

## What is already in place on the new site

| Item | Status |
|------|--------|
| `/llms.txt` with product, solution, resource and regional pages | Done (old live site returns 404) |
| FAQPage schema (home, product, pricing, contact, Tamil Nadu, Chennai) | Done |
| SoftwareApplication schema; ratings come only from real published testimonials | Done |
| Organization schema with address, contact points and size | Done |
| "ChaloSchools in short" fact lists at the top of the Tamil Nadu and Chennai pages | Done |
| Pricing stated as "per student, per year, free onboarding, migration and training" | Done |

## Gaps and actions

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | Add FAQPage schema to the 11 feature pages (FAQs already in `site-data.ts`) | Dev | To do |
| 2 | Confirm and fix the numbers every page repeats: schools (200+), students (1.5M+), modules (14 vs 16), uptime (99.9% appears in `llms.txt`) | Company | Waiting (Q3.1, Q3.12) |
| 3 | State Tamil Nadu facts plainly once confirmed: EMIS export, Samacheer Kalvi formats, Tamil messaging, RTE, Tamil TC | Company, then dev | Waiting (Q3.5–3.8); switches are in `src/config/site.ts` |
| 4 | Publish a price range ("from ₹X per student per year") | Company | Waiting (Q3.9) |
| 5 | Name client schools and add case studies with numbers (needs written permission) | Company | Waiting (Q5.4) |
| 6 | Get listed and reviewed on Capterra (exists), Techjockey, SoftwareSuggest, Techimply, G2 | Marketing | To do |
| 7 | Get named in "best school ERP in Tamil Nadu / Chennai" list articles | Marketing | To do |
| 8 | Rephrase key H2s as questions with a one-sentence answer underneath | Dev + copy | To do |
| 9 | Ask happy parents to rate the app (App Store rating is 2.1) and reply to reviews | Support | To do |

## Sentences AI tools can quote (confirm each before they go on more pages)

- "ChaloSchools is an ISO 27001:2022-certified school ERP by Inspace Edu Solutions, Chennai, used by 200+ schools and 1.5 million students."
- "ChaloSchools is built in line with India's DPDP Act, 2023, with data masking by default and AES-256 encryption."
- "ChaloSchools' AI Secretary answers questions about attendance, fees and admissions in plain language."
- "ChaloSchools supports State Board, Matriculation, CBSE, IB, Cambridge, Montessori and Pre-School schools."

Wording note: use "in line with" or "aligned with" the DPDP Act, not "compliant", unless the company confirms the stronger claim in writing (Q3.3).

## How to measure

Once a month, run the 5 category searches plus the brand searches (from Chennai, signed out) and record in `05-performance-report.md` whether Chalo is named in the AI Overview, and which competitors are.
