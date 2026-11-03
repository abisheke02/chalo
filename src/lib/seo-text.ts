// A search-result description made from a post's own text, for when its Excerpt is empty: the markup and links are
// stripped, spaces are tidied, and the text is cut at a whole word, not in the middle of one.
export function plainDescription(text: string | null | undefined, max = 160): string {
  const plain = (text ?? '')
    .replace(/<[^>]*>/g, ' ') // html tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // markdown images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links keep their words
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/[*_`>~|]/g, '') // emphasis, code and quote marks
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, '')}…`;
}
