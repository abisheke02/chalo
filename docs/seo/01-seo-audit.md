# 01 · SEO audit

_Last updated 2026-10-29 (second pass). Method: every page in the sitemap, plus the ads landing page, was requested from the local dev site and checked for title, meta description, H1, visible word count and schema types. Not yet measured: page speed, backlinks, real rankings (no keyword-data account is connected for those yet)._

## Summary

- **61 pages audited.** All return 200, all have exactly one H1, all are server-rendered (crawlers can read the text).
- **1 page has a meta description over 160 characters** (the first blog post, 264). The 19 module, board and role pages that were over were rewritten on 2026-10-29. **7 pages are under 110** (mostly news articles and webinars, which have their own editors).
- **9 pages have a title over 60 characters**: the 4 blog posts, 2 case studies, 2 news articles and 1 webinar (61–73). Titles for those come from each post in its own admin editor.
- **34 landing and post pages are thin (under 300 words)**: older feature pages (~260), board pages (~240), role pages (~165), case studies (~195) and most blog posts.
- **FAQ schema is now on all 15 module pages** (4 new this pass) plus home, product, pricing, contact and the two regional pages.
- **Done on 2026-10-29:** 8 main pages and 2 regional pages rewritten; 4 missing module pages built (Student Management, Academic Inventory, Performance Insights, AI Secretary); Managed IT moved to its own page; **Admin > SEO & Meta Tags** added so titles and descriptions can be edited without code. See the README change log.

## Priority fixes (no company answers needed)

| # | Fix | Pages | Effort | Status |
|---|-----|-------|--------|--------|
| 1 | Shorten meta descriptions to 150–158 characters | 19 module, board and role pages | Small | **Done** |
| 1b | Fix the blog post description and lengthen the news and webinar descriptions | 1 + 7 posts | Small: Blogs, News and Webinars editors | To do |
| 2 | Add FAQPage schema from the existing feature FAQs | 15 module pages | Small | **Done** |
| 3 | Shorten titles to 60 characters or fewer | 9 post pages | Small: edit in each admin editor | To do |
| 4 | Remove or redirect the duplicate webinar (`...data-security-amp-compliance...`) | 2 webinar pages | Small | To do |
| 5 | Expand thin pages: module pages to 600+ words (before/after, who uses it, connects to); role pages to 400+ | 15 + 8 pages | Medium: copy needed | To do |
| 6 | Expand blog posts under 400 words | 3 of 4 posts | Medium: copy needed | To do |
| 7 | Remove the two preview pages before launch | `/preview-home`, `/preview-heroes` | Small | To do |

## Waiting on the company

See `src/config/site.ts` and the questionnaire: EMIS / Samacheer / Tamil support (Q3.5–3.8), price (Q3.9), integration details (device brands, gateways, Tally sync, API), tracking IDs (Q4.1–4.4), DNS access and go-live date (Q4.8). Confirmed on 2026-10-29: 14 modules + 5 integrations = 19, phone +91 99622 28160, lead email enquiry@chaloschools.com, AI Secretary features all live, Managed IT on its own page.

## Site-wide status

| Area | Status |
|------|--------|
| Rendering | Server-rendered (Next.js). Good. |
| Canonical and Open Graph | Present on every page. Canonical host follows `NEXT_PUBLIC_SITE_URL`; set it at go-live. |
| Meta titles and descriptions | Defaults in `src/data/seo-pages.ts`; editable in Admin > SEO & Meta Tags (stored as `seo_title_*` and `seo_desc_*` rows). Covers every public page except blog, case-study, news and webinar posts. |
| robots.txt / sitemap.xml | Present; sitemap is dynamic and includes the regional and Managed IT pages. |
| llms.txt | Present (the old live site returns 404). Lists the confirmed 14 modules and 5 integrations. |
| Schema | Organization everywhere; SoftwareApplication on home; FAQPage on 21 pages; BreadcrumbList on main, module, board, role and post pages. |
| Tracking | Google Analytics only if `NEXT_PUBLIC_GA_ID` is set. Tag Manager and Meta Pixel wired but off until IDs are added. |
| Languages | English and Hindi only. No Tamil version. |
| Live site | Not live yet. chaloschools.com still serves the old static site. |
| Email leads | New site sends leads to enquiry@chaloschools.com. The SPF record still lacks the hosting IP (checked 2026-10-29), so emails sent from the old host can be dropped. Fix before ads launch. |

## Page-by-page results

`T` = title length, `D` = description length, `W` = visible words. ⚠ = over a limit or thin.

| Page | T | D | W | Schema |
|------|---|---|---|--------|
| `/` | 53 | 153 | 745 | AggregateRating, FAQPage, Organization, Review, SoftwareApplication |
| `/product` | 50 | 145 | 1671 | BreadcrumbList, FAQPage, Organization |
| `/pricing` | 55 | 150 | 387 | BreadcrumbList, FAQPage, Organization |
| `/school-erp-tamil-nadu` | 57 | 149 | 532 | BreadcrumbList, FAQPage, Organization |
| `/school-erp-chennai` | 45 | 146 | 531 | BreadcrumbList, FAQPage, Organization |
| `/managed-it-services` | 46 | 141 | 214 | BreadcrumbList, Organization |
| `/platform-capabilities` | 48 | 138 | 562 | BreadcrumbList, Organization |
| `/compare` | 54 | 154 | 613 | BreadcrumbList, Organization |
| `/blog` | 30 | 117 | 236 | Organization |
| `/webinars` | 23 | 127 | 145 | Organization |
| `/case-studies` | 27 | 143 | 157 | Organization |
| `/news` | 28 | 141 | 159 | Organization |
| `/help` | 35 | 112 | 127 | Organization |
| `/release-notes` | 28 | 106 ⚠ | 206 | Organization |
| `/about` | 55 | 142 | 601 | BreadcrumbList, Organization |
| `/security` | 56 | 140 | 479 | BreadcrumbList, Organization |
| `/contact` | 42 | 132 | 274 | BreadcrumbList, FAQPage, Organization |
| `/careers` | 22 | 142 | 305 | Organization |
| `/privacy` | 29 | 137 | 604 | Organization |
| `/terms` | 31 | 100 ⚠ | 660 | Organization |
| `/features/admissions` | 36 | 151 | 270 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/fees` | 29 | 154 | 270 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/attendance` | 36 | 130 | 263 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/exams` | 37 | 138 | 260 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/timetable` | 48 | 126 | 264 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/parent-app` | 35 | 151 | 286 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/staff-hr` | 41 | 148 | 263 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/library` | 33 | 144 | 252 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/transport` | 35 | 144 | 263 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/whatsapp` | 37 | 160 | 257 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/reports` | 34 | 136 | 255 ⚠ | BreadcrumbList, FAQPage, Organization |
| `/features/student` | 33 | 121 | 314 | BreadcrumbList, FAQPage, Organization |
| `/features/inventory` | 42 | 140 | 308 | BreadcrumbList, FAQPage, Organization |
| `/features/performance-insights` | 43 | 140 | 300 | BreadcrumbList, FAQPage, Organization |
| `/features/ai-secretary` | 27 | 140 | 338 | BreadcrumbList, FAQPage, Organization |
| `/solutions/pre-school` | 34 | 151 | 246 ⚠ | BreadcrumbList, Organization |
| `/solutions/state-cbse` | 36 | 144 | 255 ⚠ | BreadcrumbList, Organization |
| `/solutions/ib` | 34 | 150 | 240 ⚠ | BreadcrumbList, Organization |
| `/solutions/cambridge` | 33 | 148 | 225 ⚠ | BreadcrumbList, Organization |
| `/solutions/montessori` | 34 | 151 | 225 ⚠ | BreadcrumbList, Organization |
| `/solutions/matric` | 49 | 151 | 256 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/school-owners` | 45 | 113 | 187 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/principals` | 42 | 141 | 169 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/teachers` | 40 | 123 | 164 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/parents` | 39 | 114 | 165 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/accountants` | 43 | 144 | 164 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/administrators` | 46 | 145 | 172 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/coordinator` | 43 | 145 | 167 ⚠ | BreadcrumbList, Organization |
| `/solutions/role/transport-incharge` | 50 | 138 | 178 ⚠ | BreadcrumbList, Organization |
| `/blog/why-every-school-needs-a-modern-school-erp-system-in-2026` | 72 ⚠ | 264 ⚠ | 574 | BlogPosting, BreadcrumbList, ImageObject, Organization, WebPage |
| `/blog/5-signs-your-school-needs-a-new-management-system` | 64 ⚠ | 108 ⚠ | 305 | BlogPosting, BreadcrumbList, ImageObject, Organization, WebPage |
| `/blog/how-ai-is-transforming-school-administration-in-india` | 68 ⚠ | 120 | 233 ⚠ | BlogPosting, BreadcrumbList, ImageObject, Organization, WebPage |
| `/blog/the-complete-guide-to-digital-fee-collection-for-schools` | 71 ⚠ | 120 | 238 ⚠ | BlogPosting, BreadcrumbList, ImageObject, Organization, WebPage |
| `/case-studies/how-dav-schools-reduced-fee-collection-time-by-60` | 65 ⚠ | 124 | 197 ⚠ | Article, BreadcrumbList, ImageObject, Organization, WebPage |
| `/case-studies/air-force-school-chennai-a-digital-transformation-journey` | 73 ⚠ | 133 | 201 ⚠ | Article, BreadcrumbList, ImageObject, Organization, WebPage |
| `/news/chaloschools-launches-ai-powered-timetable-scheduler` | 67 ⚠ | 102 ⚠ | 163 ⚠ | BreadcrumbList, ImageObject, NewsArticle, Organization, WebPage |
| `/news/chaloschools-crosses-200-schools-milestone` | 57 | 88 ⚠ | 165 ⚠ | BreadcrumbList, ImageObject, NewsArticle, Organization, WebPage |
| `/news/upcoming-webinar-fee-management-best-practices` | 62 ⚠ | 72 ⚠ | 151 ⚠ | BreadcrumbList, ImageObject, NewsArticle, Organization, WebPage |
| `/webinars/data-security-amp-compliance-for-school-erps` | 61 ⚠ | 93 ⚠ | 177 ⚠ | BreadcrumbList, EducationEvent, Organization, VirtualLocation |
| `/webinars/data-security-compliance-for-school-erps` | 57 | 110 | 187 ⚠ | BreadcrumbList, EducationEvent, Organization, VirtualLocation |
| `/lp/school-erp-tamil-nadu` | 48 | 129 | 342 | Organization |

Limits used: title ≤ 60, description 110–160, landing and post pages ≥ 300 words.
