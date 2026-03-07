export default function getLanguageFromCookies(req) {
  const cookie = req?.headers?.cookie || '';
  const match = cookie.match(/(?:^|;\s*)tmdb-lang=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : 'en-US';
}
