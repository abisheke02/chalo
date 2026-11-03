// Turns a link someone pastes (a YouTube or Vimeo page, a short link, or a direct .mp4) into something the page can play.
// Only these hosts are accepted for embedding; anything else is ignored, so a pasted link can never put a stranger's page on the site.

export interface VideoLink {
  kind: 'iframe' | 'file';
  src: string; // what goes in the player
  thumb: string | null; // a still picture, when the host gives one
}

const YT = /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const VIMEO = /vimeo\.com\/(?:video\/)?(\d{6,12})/;

export function parseVideoLink(raw: string | null | undefined): VideoLink | null {
  const url = (raw ?? '').trim();
  if (!/^https:\/\//i.test(url)) return null;
  const yt = url.match(YT);
  if (yt) {
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`, thumb: `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` };
  }
  const vm = url.match(VIMEO);
  if (vm) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}`, thumb: null };
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return { kind: 'file', src: url, thumb: null };
  return null;
}

export interface LinkedVideo extends VideoLink {
  id: string;
  title: string;
}

// The "Video links" box in Admin > Site Content: one video a line, "Title | link". Lines that are not valid are skipped.
export function parseVideoList(text: string | null | undefined): LinkedVideo[] {
  return (text ?? '')
    .split(/\r?\n/)
    .map((line, i) => {
      const [title, ...rest] = line.split('|');
      const link = parseVideoLink(rest.join('|'));
      return title?.trim() && link ? { id: `link-${i}`, title: title.trim(), ...link } : null;
    })
    .filter((v): v is LinkedVideo => v !== null);
}
