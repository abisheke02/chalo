# 04 · Campaign plan (Google and Meta ads)

_Last updated 2026-10-29. Condensed from the SEO, GEO and Ads plan. All money figures are estimates; revise after 2–4 weeks of real data. Budget and claims need company approval (questionnaire section 8.1 and 8.3)._

## Goal and recommendation

Book demos from Tamil Nadu schools. Start with the **Recommended** budget for two months, then adjust.

| Level | Google | Meta | Ad spend | With GST (18%) and extras |
|-------|--------|------|----------|---------------------------|
| Starter | ₹30,000 | ₹15,000 | ₹45,000 | about ₹53,000–58,000 / month |
| **Recommended** | ₹60,000 | ₹30,000 | ₹90,000 | about ₹1.26–1.43 lakh / month |
| Aggressive | ₹1,00,000 | ₹50,000 | ₹1,50,000 | about ₹2.21–2.53 lakh / month |

One-time setup: usually ₹20,000–50,000 (landing page and tracking if outsourced, creatives, a demo video). GST on ad spend can usually be claimed as input tax credit if the company GSTIN is on both ad accounts.

## Expected results (Recommended budget, estimates)

| Stage | Google | Meta | Total |
|-------|--------|------|-------|
| Leads, month 1 | 25–60 | 40–80 | 65–140 |
| Leads, months 2–3 | 50–100 | 70–150 | 120–250 |
| Demos booked | 15–40 | 10–30 | 25–70 |
| Schools signed | 2–8 | 1–4 | 3–12 per month |

**Treat the signing numbers with care.** School deals take 1–3 months and many schools buy March–June, so in months 1–2 judge the campaign by leads and demos, not signings.

## Google Ads (₹60,000 / month)

- Search only (Search Partners and Display off); Tamil Nadu, "presence" targeting; English and Tamil; Mon–Sat 9 am–7 pm.
- Bidding: Maximize Clicks with a ₹80 cap for 2 weeks, then Maximize Conversions after 15+ leads.
- Conversions: demo form submit (`generate_lead`), WhatsApp click (`whatsapp_click`), call click (`call_click`). The site already sends these events.

| Campaign | Budget | Landing page | Status |
|----------|--------|--------------|--------|
| Brand | ₹3,000 | Homepage | Page ready |
| School ERP Tamil Nadu | ₹20,000 | `/lp/school-erp-tamil-nadu` | **Page built** (noindex, form, WhatsApp) |
| Chennai and other cities | ₹15,000 | `/school-erp-chennai`; city pages not built | Chennai ready; Coimbatore, Madurai, Trichy, Salem to build |
| By board | ₹10,000 | `/solutions/...` pages | Pages exist |
| By feature | ₹12,000 | `/features/...` pages | Pages exist; feature pages are thin (see audit) |

Negative keywords: login, sign in, parent login, emis login, job, jobs, salary, free download, apk, project, source code, course, pdf.

Ad text (checked against Google's limits, 30 characters for headlines and 90 for descriptions) is in the full plan document.

## Meta Ads (₹30,000 / month)

- Objective Leads with an Instant Form set to "Higher intent"; Tamil Nadu; separate English and Tamil ads; Facebook and Instagram only.
- Cold audience (₹18,000): principals, correspondents, owners, trustees, administrators aged 28–65. Retargeting (₹7,000): website visitors, video viewers. Lookalike (₹5,000) from week 4.
- Creatives: "50+ WhatsApp groups → one app" Reel; AI Secretary demo; module carousel; trust image (ISO, DPDP, 200+ schools); Tamil versions; testimonial video in month 2.

## Launch blockers

| Blocker | Why it matters | Owner | Status |
|---------|----------------|-------|--------|
| SPF record missing the hosting IP | Lead emails can be silently dropped | IT | **Open** (re-checked 2026-10-29) |
| New site not live (DNS) | Ads should point at the new site | IT / company | Open |
| Tracking IDs (GA4, Tag Manager, Meta Pixel, Google Ads) | No conversion data without them | Company | Open (Q4.1–4.4); site code is ready |
| Phone and WhatsApp number confirmed | Call and WhatsApp buttons | Company | Open (Q6.3); WhatsApp uses the existing number |
| Claims approved: 200+ schools, 1.5M students, DPDP wording | Ad policy and trust | Company | Open (Q3.1–3.3) |
| Someone to call leads within 1 hour | Speed decides conversion | Sales | Open (Q6.1–6.2) |
| Budget approved and ad accounts owned by the company | Cannot spend without it | Company | Open (Q1.3, Q4.1–4.7) |

## Weekly routine

| When | Google | Meta |
|------|--------|------|
| Daily (weeks 1–2) | Check search terms; add negatives | Pause ads above ₹600 per lead |
| Weekly | Pause keywords with ₹2,000 spent and no lead | Swap weak creatives; test a new headline |
| Monthly | Report leads, demos, cost per demo | Refresh creatives |

Record results in `05-performance-report.md`.
