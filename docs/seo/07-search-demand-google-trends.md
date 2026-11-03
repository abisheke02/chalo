# 07 · Search demand (Google Trends via Supermetrics)

_Pulled 2026-10-29 from Google Trends through Supermetrics, for the last 12 months (2025-11-01 to 2026-10-28). Google Trends gives **relative interest, not search volumes**: 100 is the highest point in a query, and a value of 50 means half as popular. Real volumes need the Google Ads Keyword Planner (see "Next data to pull")._

## School ERP versus school management software (India, by state)

Both terms were queried together, so the numbers are comparable. "School ERP" is searched far more than "school management software" in every state.

| State | "school erp" | "school management software" |
|-------|--------------|------------------------------|
| Tamil Nadu | 70 | 30 |
| Kerala | 58 | 42 |
| Karnataka | 60 | 40 |
| Andhra Pradesh | 59 | 41 |
| Telangana | 66 | 34 |
| Maharashtra | 72 | 28 |
| Delhi | 84 | 16 |
| Uttar Pradesh | 85 | 15 |

Small states and territories (Puducherry, Manipur, Meghalaya) show 100 on very little data. Ignore them. Goa, Sikkim and others show 0 (not enough data). The Tamil Nadu region code was not accepted by the tool, so there is no month-by-month trend for Tamil Nadu alone yet.

## What people search next to "school erp" (India)

| Related search | Interest | What it tells us |
|----------------|----------|------------------|
| school erp login | 100 | The biggest group of searchers are existing users trying to log in, not buyers |
| school erp software | 25 | The main buying phrase |
| vivekanand school erp | 15 | A school's own branded ERP (people searching for a product they already use) |
| school erp system | 12 | Another buying phrase |
| ptc school erp | 4 | A branded ERP |
| lead school erp | 1 (but **rising**, 100 in the rising list) | LEAD School is growing as a search |

## What this means for Chalo

1. **Keep "login" as a negative keyword in ads.** Most "school erp" searches are logins, and the plan already excludes them.
2. **Use "school ERP software" and "school ERP system" in titles and copy**, not only "school management software". The ERP phrasing has about twice the interest in Tamil Nadu. The home title and the regional pages already use "School ERP".
3. **People search by brand.** Branded searches ("vivekanand school erp", "lead school erp") show that schools look for a named product. Chalo needs its own branded searches to work: make sure the marketing site outranks the login pages for "chalo schools".
4. **LEAD School is a rising name** worth adding to `03-competitive-brief.md` after checking what it offers and whether it competes in Tamil Nadu.

## Limits

- Relative numbers only; no monthly volumes, cost per click or difficulty.
- India-level and state-level only for this pull; no city-level (Chennai, Coimbatore) data.
- Search type: web search.

## Next data to pull

| Need | How | Needs |
|------|-----|-------|
| Monthly search volumes and cost per click for the 5 category searches | Google Ads (read operation `keyword_volumes`) or Keyword Planner | Sign in to Google Ads (or Keyword Planner) in Supermetrics |
| Real queries, clicks and rankings for the live site | Google Search Console | Sign in to Search Console in Supermetrics |
| Traffic and form conversions | Google Analytics 4 | Sign in to GA4 in Supermetrics |
| Meta ad results | Facebook Ads | Sign in to Meta Ads in Supermetrics |

Sources already open without sign-in: Google Trends and Facebook Public Data.
