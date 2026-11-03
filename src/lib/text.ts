// The admin API HTML-escapes everything it stores (& < > " ' /), and React
// escapes text again when it draws it, so a title saved as "Fees & Finance"
// used to appear on screen as "Fees &amp; Finance". This undoes the first pass.
// Only use it on short plain-text fields, never on content rendered as HTML.
export function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');
}
