// JSON-LD (the data blocks search engines read) is written into a <script> tag.
// Plain JSON.stringify would let a title containing "</script>" close that tag
// early, so every "<" and the two line-separator characters are written as
// escape sequences. The JSON stays valid and means exactly the same thing.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
