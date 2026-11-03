# ChaloSchools SEO, GEO and ads: working documents

These files are the living record for the SEO, GEO and ads work. Keep them current: update the file, then add a line to the change log below.

| File | What it is | Update when |
|------|-----------|-------------|
| [01-seo-audit.md](01-seo-audit.md) | Page-by-page audit of all 61 pages, priority fixes, site-wide status | After any page change. Re-run the audit and replace the table |
| [02-ai-visibility-geo.md](02-ai-visibility-geo.md) | Being named in AI answers: state, gaps, actions, quotable facts | Monthly, or when facts change |
| [03-competitive-brief.md](03-competitive-brief.md) | Who ranks for school ERP in Tamil Nadu and what they have that Chalo lacks | Monthly, and before ads launch |
| [04-campaign-plan.md](04-campaign-plan.md) | Google and Meta ads plan, budget, blockers | When budget, claims or blockers change |
| [05-performance-report.md](05-performance-report.md) | Baseline, targets, weekly campaign log, monthly search check | Weekly during ads; monthly for SEO |
| [06-connect-ahrefs-and-supermetrics.md](06-connect-ahrefs-and-supermetrics.md) | How to connect the Ahrefs and Supermetrics data sources | Once, then if access changes |
| [09-post-titles-and-descriptions.md](09-post-titles-and-descriptions.md) | Suggested shorter titles and descriptions for blog, case-study and news posts, and the webinar finding | Once, when the posts are edited |
| [08-content-strategy.md](08-content-strategy.md) | How the site should explain modules, automation and integrations; page template, new pages, home flow | Before and after any content rebuild |
| [12-module-page-copy-draft.md](12-module-page-copy-draft.md) | Draft wording for "Who uses it" and "Works with" on 11 module pages, awaiting approval | Once approved and built |
| [07-search-demand-google-trends.md](07-search-demand-google-trends.md) | Real search-interest data for school ERP terms (Google Trends via Supermetrics) | Monthly, or when new data sources are signed in |

Related code: `src/config/site.ts` holds everything the company still has to confirm (phone, price, tracking IDs, Tamil Nadu feature switches).

## Editing titles and descriptions (no code)

Admin dashboard > **SEO & Meta Tags**. It lists every public page (main pages, search landing pages, module, board and role pages, resources). For each page you can:

1. Type a new title and/or description. A counter shows the length (titles count the " | ChaloSchools" suffix, limit 60; descriptions aim for 110–160), and a preview shows how it can look on Google.
2. Press **Save**. The page uses the new text straight away, including the social-sharing title.
3. Press **Reset to default** to go back to the built-in text.

A blank field means "use the default". Defaults live in `src/data/seo-pages.ts`; saved edits are stored in the site-content table (`seo_title_*`, `seo_desc_*`). Blog, case-study, news and webinar posts keep their own editors.

## How these were made

Written on 2026-10-29. The `marketing:seo-audit`, `small-business:seo-ai-visibility`, `marketing:competitive-brief`, `marketing:campaign-plan` and `marketing:performance-report` skills were not available in that session ("unknown command"), so the same work was done directly: the audit by requesting every page of the running site, the rest from the SEO, GEO and Ads plan and from the site code. Competitor search data comes from the plan and has not been re-checked.

## Open questions for the company

Questionnaire items that block work: Q3.1–3.3 (claims), Q3.5–3.8 (EMIS, Samacheer, Tamil, RTE), Q3.9–3.10 (price, offer), Q3.12 (module count), Q4.1–4.8 (accounts, DNS), Q6.1–6.4 (lead handling, phone).

## Change log

| Date | Change |
|------|--------|
| 2026-10-29 | Main pages (home, product, pricing, compare, about, contact, security, platform capabilities): new keyword titles, descriptions under 160 characters, FAQ schema on pricing and contact, breadcrumb schema on the 7 inner pages |
| 2026-10-29 | New pages `/school-erp-tamil-nadu` and `/school-erp-chennai` (sitemap, `llms.txt`, footer links); Tamil Nadu feature claims hidden behind switches in `site.ts` |
| 2026-10-29 | Ads landing page `/lp/school-erp-tamil-nadu` (noindex, lead form, WhatsApp and call tracking); Tag Manager and Meta Pixel wired, off until IDs are set |
| 2026-10-29 | Home title shortened to 53 characters; "19+ modules" replaced by one value in `site.ts` |
| 2026-10-29 | Confirmed: 14 modules + 5 integrations = 19 (count plan in 08); phone +91 99622 28160; leads to enquiry@chaloschools.com; AI Secretary all features live |
| 2026-10-30 | Removed the sideways "Fourteen modules. One platform." row from `/product` at the owner's request (the Module explorer below it stays). The component file stays, used only by the internal `/preview-home` |
| 2026-10-29 | **Module content is now on the site.** All 14 module pages show the new content from `docs/content` (data in `src/data/module-content.ts`, shown by `src/components/ModuleDeepSections.tsx`): in-short answer, what it is for and replaces, six things you'll see, how to use it step by step, example, who uses it, outputs, connections, merged questions and Continue-to links. New SEO titles and descriptions apply. Payroll Management has its own page, `/features/payroll` (62 public pages now); Staff is staff only. Everything awaiting confirmation was left out. Parent app and Reports pages keep the old layout. Module pages grew from about 290 to 510 to 810 words |
| 2026-10-29 | Added the deep page content for all 14 modules in `docs/content/04`, `05` and `06`: purpose, the problem replaced, step-by-step use (set up once, every day, every term), an example, roles, outputs, connections and questions. Workflows are built from the published feature list; screen names and step order still need the product team. Removed two claims the site does not support (payroll posting to Tally, AI Secretary following role permissions) and marked them [confirm] |
| 2026-10-29 | Added `02-integration-pages.md` (hub plus 5 integration pages) and `03-ai-secretary-full-page.md` (the flagship page, hero to closing call to action) to `docs/content/`. Not on the site yet |
| 2026-10-29 | New folder `docs/content/`: `00-lists-and-site-map.md` (14 modules, 5 integrations, all 61 public URLs plus technical and internal pages, visitor journey) and `01-module-content.md` (title, description, H1, answer-first summary, "Open it and you'll see", roles, connections, FAQs and next steps for all 14 modules). Not yet on the site |
| 2026-10-29 | Drafted the wording for "Who uses it" and "Works with" on 11 module pages (12), from published facts only; awaiting approval, not on the site |
| 2026-10-29 | Home fix plan (11), rounds 1 to 3 built: new hero subline (outcome + Chennai/Tamil Nadu), proof line and Chat on WhatsApp under the buttons, stats band now 200+ schools / 1.5+ million students / 14 modules / 5 integrations ("4 Countries" and "99.9% uptime" removed as unconfirmed; the live database values must be changed in Admin > Site Content, keys trust_stat_3 and trust_stat_4), apps named by audience, pricing line on free onboarding, the 14 modules grouped in six areas (`data/module-areas.ts`), a one-line integrations sentence, and a "Part of / Works with" block on every module page. Round 4 (phone, speed) not done: needs a real device |
| 2026-10-29 | REVERTED (at the owner's request): the stacking scroll effect (`StackLayer`, `homeStackScroll`) is removed; the home page is back to ordinary scrolling, text verified identical |
| 2026-10-29 | Home page stacking scroll effect applied to the EXISTING sections only (no content changed; visible text checked identical, 965 words): each section stays in place and the next slides over it. `StackLayer.tsx` wraps each section; one switch `homeStackScroll` in `src/config/site.ts`. Off on phones and for reduced motion. The earlier extra content (Scroll Story, sideways row on the home page) was removed at the owner's request |
| 2026-10-29 | Home page scroll animations from `/preview-home`: top progress bar, hero copy and carousel drift at different speeds, the lower modules section is now the pinned sideways row of 14 cards (links straight to each module page; heading still editable; integrations strip kept), and a new "Scroll Story" section of stacking cards after it (switch it off in Admin > Section Visibility). The earlier second carousel (`ModuleCarouselSection.tsx`) is kept, unused |
| 2026-10-29 | Header redesigned as a floating pill (logo left, centred pill with Home, Modules, Solutions, Resources, Company, Pricing, round Book a Demo button right), after the VisionNex `vis-main` header design, rebuilt on Chalo's own menus and colours. Previous header kept as `src/components/sections/Header.classic.tsx` |
| 2026-10-29 | Home hero: the right-hand visual is now the preview's module carousel around the campus (barrel layout, scaled for phones); copy, buttons and translations unchanged. New logo (900 px wide, transparent background, made from the supplied image) in the header, footer and ads page; the previous logo is kept as `public/images/logo-previous.png` |
| 2026-10-29 | Home page: the module grid is replaced by the 3D module carousel (option A from the preview), with a phone version, the integrations strip kept, and 14 plain links underneath for search engines. The old grid file (`FeatureHighlights.tsx`) is kept, unused |
| 2026-10-29 | Fixed the "&amp;" display bug site-wide: short text fields (titles, descriptions, names, questions) are decoded as they are read from the database; the long `content` fields are not. All search-engine data blocks (JSON-LD) now escape "<", checked with a planted `</script>` test |
| 2026-10-29 | Found the two similar webinars are different (one is an admissions webinar with the wrong title); added suggested wording for 9 posts in 09 |
| 2026-10-29 | Rewrote the meta descriptions of 19 module, board and role pages (all 113–154 characters; visible page text unchanged). Only the first blog post is still over 160 |
| 2026-10-29 | Public email is now enquiry@chaloschools.com everywhere (footer, contact, privacy, terms, search data, chatbot, ads page), set once in `src/config/site.ts`. The live database still holds the old contact email: change it in Admin > Site Content (key `contact_email`) |
| 2026-10-29 | Built the 4 missing module pages (Student, Inventory, Performance Insights, AI Secretary); FAQ schema on all 15 module pages; stale "19+ modules" removed from About, board stats, chatbot and llms.txt |
| 2026-10-29 | Managed IT services moved to `/managed-it-services`; home page keeps one link; footer and sitemap updated |
| 2026-10-29 | Added Admin > SEO & Meta Tags: edit any page's title and description without code (all public pages except posts) |
| 2026-10-29 | Scope: Automation page and "day at a school" story dropped from the content plan |
| 2026-10-29 | Added `08-content-strategy.md`: module grouping, page template, Automation and Integrations pages, new home flow (plan only, not built) |
| 2026-10-29 | Supermetrics connected; first real data (Google Trends) saved in 07. Search Console, GA4, Google Ads, Meta Ads still need sign-in |
| 2026-10-29 | Ahrefs connected but returns "Insufficient plan" for all data requests; Supermetrics still to authorise (see 06) |
| 2026-10-29 | Created this folder: audit of 56 pages, GEO notes, competitive brief, campaign plan, performance report, connector steps |
