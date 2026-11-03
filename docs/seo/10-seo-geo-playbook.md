# SEO and GEO playbook (reusable for any website)

_What was done on one project, in the order it was done, with the project's details removed. GEO means being named and quoted in AI answers (Google AI Overviews, ChatGPT, Perplexity)._

## Phase 0 · Find out where you stand (no changes yet)

1. **Check how the site renders.** View the page source. If the real text is there, search engines and AI tools can read it. If you only see an empty container, fix that first (server-side rendering or pre-rendering).
2. **Crawl your own site.** Request every page and record: status code, title length, description length, number of H1s, visible word count, schema types. Put it in a table. This is your baseline.
3. **Look at the search results for the queries you want.** Note who ranks, who appears in the map pack and the AI answer, and what your brand search shows (login pages outranking the marketing site, old pages, look-alike competitors).
4. **Check the technical files:** robots.txt, sitemap, llms.txt, canonical and social tags, schema, analytics and tracking tags, available languages.
5. **Check that leads actually arrive.** Test the form-to-email path and the email DNS records (SPF, and so on). Ads are wasted if leads are silently dropped.
6. **List the facts the site repeats** (counts, numbers, claims) and check they agree on every page.
7. **Check whether a new site is live yet.** Audit the one that will be live, but know which one search engines see today.

## Phase 1 · Foundations (technical)

1. **One config file for facts and switches:** phone, email, counts, price, tracking IDs, and an on/off switch for each claim you have not confirmed. Nothing unconfirmed is shown until a switch is on.
2. **One source for every repeated number.** Decide the wording rule (for example "14 modules and 5 integrations", never a mixed number) and use it everywhere.
3. **Titles and descriptions:** keyword-led, title 60 characters or fewer including the brand name, description 110–160. Rewrite weak ones ("Pricing", "Contact Us").
4. **One H1 per page**, with headings that match real questions.
5. **Canonical and social-sharing tags on every page**, using one site-address setting you change at go-live.
6. **Schema (structured data):** organisation, product or software, FAQ, breadcrumbs, article and event pages. Write the data safely so stored text can never close the script tag.
7. **Sitemap generated from the real pages, robots.txt** blocking admin, login and API, and **noindex** on ads landing pages and previews.
8. **llms.txt:** a plain summary of what the site offers, with links, for AI crawlers.
9. **Fix broken, duplicate or mislabelled pages.** Check before deleting: two similar pages may have different content.
10. **Internal links crawlers can follow.** If a widget (carousel, animated card) opens pages with a click only, add plain text links beside it. Add footer links to important pages.
11. **Tracking ready but off:** analytics, tag manager and ad pixels wired in, switching on when IDs are added. Send conversion events for form leads, WhatsApp clicks and call clicks. Save the ad campaign tags (UTM) with each lead.
12. **Fix text-encoding bugs** (for example "&amp;" showing on screen) at the source, and re-test.
13. **Look for bloat.** One file had millions of blank lines and slowed every build.

## Phase 2 · Content structure

1. **A hub page plus one page per module, feature or service**, each built from the same template: outcome headline, before and after, what it does, who uses it, FAQs, call to action.
2. **Fill the gaps.** Anything that appears in menus but has no page of its own gets one.
3. **Segment pages:** one per customer type, role or category you serve.
4. **Location pages** for the places you want to rank in. Use only facts that are true; keep unconfirmed local claims behind switches.
5. **Group items the way a buyer thinks** (six clear areas beat a flat list of 14 names).
6. **Move off-topic content to its own page** so the main pages stay focused.
7. **Trust pages:** pricing, security and compliance, comparison page, case studies.
8. **Fix thin pages** (target 300 to 600 words and more for key pages).
9. **Start key pages with a short, quotable "in short" list** (who you are, where, scale, certifications).

## Phase 3 · GEO (AI answers)

1. **State plain facts in short sentences** with real numbers (who, where, how many, certified by whom).
2. **FAQ content with FAQ schema** on the pages that matter.
3. **llms.txt** (see Phase 1).
4. **Get named elsewhere:** review and directory sites, "best of" list articles, a Google Business Profile with reviews.
5. **Word claims carefully** ("built in line with" the regulation, not "compliant") until the company confirms the stronger version.
6. **Measure monthly:** run the same searches, and record whether you appear in the AI answer, and which competitors do.

## Phase 4 · Search demand, competitors and ads

1. **Competitor brief:** who wins your searches, what they have that you lack, what you have that they do not.
2. **Check search demand** (Google Trends for free, Keyword Planner or an SEO tool for volumes). Notice intent: if most searches are "login", add that as a negative keyword.
3. **Ads landing page:** no site menu, one message, one short form, call and WhatsApp buttons, noindex, conversion events.
4. **Campaign plan:** budget levels, campaigns grouped by intent, negative keywords, ad text within character limits, a weekly routine.
5. **Do not launch ads until:** leads reach a person, tracking IDs are in, claims are approved, the site is live, someone will call within an hour.
6. **Connect data tools** (SEO tool, ad and analytics connector). Check that the account's plan includes data access before you rely on it.
7. **Set realistic expectations:** with long sales cycles, judge the first months by leads and demos, not signed customers.

## Phase 5 · Make it maintainable

1. **An admin screen to edit titles and descriptions without code:** defaults in one list, edits override them, character counters and a Google preview, reset to default.
2. **A folder of living documents:** audit, GEO notes, competitor brief, campaign plan, performance report, content strategy, and a change log. Update them after every change.
3. **Re-run the audit after each change** to prove what moved.
4. **A questionnaire for the company** listing every fact and access you need: goals and budget, claims, accounts, assets, sales process, tracking.

## Working habits that paid off

- **Verify before claiming.** Several "problems" turned out to be wrong when checked.
- **Change meta text without touching visible text** when you only want to fix search results.
- **Test security-sensitive changes with a planted attack string**, then remove it.
- **Keep a revert copy** of anything you redesign (old header, old logo).
- **Ask for facts before publishing claims**, and gate them with switches.
- **When a tool or skill is unavailable, do the work directly** and write down that you did.
- **Pause and ask when a request could mean several different things.**

## Suggested order for a new site

1. Phase 0 audit and baseline table
2. Phase 1 items 1–8 (config, titles, H1, canonical, schema, sitemap, robots, llms.txt)
3. Questionnaire to the company
4. Phase 2 templates and missing pages
5. Phase 1 items 9–13 and Phase 3
6. Phase 5 admin screen and docs
7. Phase 4 ads, once the blockers are cleared
