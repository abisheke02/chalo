# 06 · Connect Ahrefs and Supermetrics

Why: Ahrefs gives keyword volumes, rankings, backlinks and competitor data. Supermetrics pulls ad and analytics numbers (Google Ads, Meta Ads, GA4, Search Console) into one place. Together they replace guesses in `03-competitive-brief.md` and `05-performance-report.md` with real data.

**This has to be done by a person in an interactive session.** Authorising opens a browser sign-in, which Claude cannot do from a non-interactive run. Never paste passwords, API keys or tokens into the chat.

## Status (2026-10-29)

| Connector | State |
|-----------|-------|
| Ahrefs | Signed in and connected, but **every data request returns "Insufficient plan"** (tested with the usage check and a keyword lookup for the 5 category searches). The account does not include API / MCP data access. No Ahrefs data has been used in these documents. |
| Supermetrics | Connected. Google Trends works without sign-in (data in `07-search-demand-google-trends.md`). Search Console, GA4, Google Ads and Meta Ads still need their own sign-in inside Supermetrics (status NOT_AUTHENTICATED on 2026-10-29). |

To unblock Ahrefs: ask the Ahrefs account owner whether the plan includes API access, or move to a plan that does. Until then use the free alternatives below.

## Free alternatives while waiting

| Need | Free option |
|------|-------------|
| Keyword volumes for Tamil Nadu searches | Google Keyword Planner (needs a Google Ads account; free to use) |
| Real rankings, clicks and queries for the site | Google Search Console, once the new site is live and verified |
| Traffic and conversions | Google Analytics 4 (set `NEXT_PUBLIC_GA_ID`) |
| Site health for our own site | Ahrefs Webmaster Tools (free for verified sites) or Search Console |
| Competitor pages | Manual checks of the top 3 competitors' pricing, feature and Tamil Nadu pages |

## Before you start

| Need | Ahrefs | Supermetrics |
|------|--------|--------------|
| Account | An Ahrefs account on a plan that includes API / MCP access. Check Ahrefs account settings, since access depends on the plan. | A Supermetrics account (a free trial is usually available) |
| Data | Nothing else; Ahrefs holds its own data | The sources you want must be linked inside Supermetrics first: Google Search Console, GA4, Google Ads, Meta Ads |
| Who | The person who owns the Ahrefs login | The person who owns the Google Ads, GA4 and Meta accounts (questionnaire Q4.1–4.4) |

## Steps (Claude Code, in the terminal or VS Code)

These servers appear to Claude as `plugin:marketing:ahrefs` and `plugin:marketing:supermetrics`.

1. Open Claude Code in the project folder, in a normal interactive session.
2. Type `/mcp` and press Enter. A list of servers appears.
3. Select **plugin:marketing:ahrefs**, then choose **Authenticate**.
4. Your browser opens. Sign in to Ahrefs and click **Allow / Approve**. Return to Claude Code.
5. Repeat steps 3–4 for **plugin:marketing:supermetrics**. Sign in and approve access to the data sources you want to share.
6. Back in `/mcp`, both servers should show **connected**. If they do not, start a new Claude Code session so the tools load.

## Steps (claude.ai in the browser, as an alternative)

1. Go to **claude.ai → Settings → Connectors**.
2. Find **Ahrefs** (and **Supermetrics**) and click **Connect**.
3. Sign in and approve access when prompted.
4. Start a new chat or session; the tools appear there.

If you only see them under `/mcp` in Claude Code, use the first method.

## Check that it worked

Ask Claude: "Using Ahrefs, show the monthly search volume and keyword difficulty for 'school erp chennai', 'school erp tamilnadu' and 'school management software'." For Supermetrics: "Show last 30 days of clicks and impressions from Search Console for chaloschools.com."

## What to use it for

- **Ahrefs:** keyword research for the Tamil Nadu and city pages; which pages competitors rank for; backlink gaps; ranking tracking for the 5 category searches.
- **Supermetrics:** weekly numbers for the campaign log in `05-performance-report.md` (spend, clicks, leads by campaign), and Search Console data once the new site is live.

## If something goes wrong

| Problem | Try |
|---------|-----|
| "Authenticate" does nothing | Run it from a normal interactive session, not a scheduled or background run |
| Browser sign-in loops | Sign out of the other Ahrefs or Google account first, or use a private window |
| Connected but no tools | Start a new session |
| Ahrefs refuses data | Your plan may not include API / MCP access; check with Ahrefs |
| Supermetrics returns nothing | Link the data source (Search Console, GA4, Ads) inside Supermetrics first |
| Data for the new site is empty | The site is not live yet and not verified in Search Console |
