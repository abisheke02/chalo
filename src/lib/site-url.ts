// Single source of truth for the site's own origin, used everywhere a
// self-referential absolute URL is needed (sitemap, robots.txt, canonical
// tags, Open Graph, JSON-LD). Hardcoding "chaloschools.com" here would be
// wrong on any deployment that isn't actually served from that domain —
// which was the bug: every Render deployment (chaloweb.onrender.com,
// erpweb-1jiy.onrender.com) was emitting canonical/sitemap/breadcrumb URLs
// pointing at chaloschools.com, a domain that runs a completely different
// (old) site. Crawlers following those off-site links found broken/foreign
// pages and abandoned indexing the rest of the site.
//
// RENDER_EXTERNAL_URL is auto-populated by Render on every web service, so
// this resolves correctly with zero manual config on any Render deploy.
// NEXT_PUBLIC_SITE_URL is an explicit override for when a real custom domain
// (e.g. chaloschools.com once DNS is cut over) should take precedence.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  'https://chaloschools.com'
).replace(/\/+$/, '');
