const API_BASE_URL = 'https://api.jikan.moe/v4';
const RATE_LIMIT_DELAY = 1500;
let lastRequestTime = 0;

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function request(path, { retries = 2 } = {}) {
  const now = Date.now();
  const since = now - lastRequestTime;
  if (since < RATE_LIMIT_DELAY) await delay(RATE_LIMIT_DELAY - since);

  lastRequestTime = Date.now();
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (res.status === 429 && retries > 0) {
    await delay(4000);
    return request(path, { retries: retries - 1 });
  }
  if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
  const json = await res.json();
  return { data: json.data, pagination: json.pagination };
}

function qs(params){
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => {
    if (v === undefined || v === null || v === '') return;
    search.set(k, String(v));
  });
  return search.toString();
}
export const jikan = {
  getTopAnime: (page = 1, limit = 24) => request(`/top/anime?${qs({ page, limit })}`),
  getSeasonalAnime: (page = 1, limit = 24) => request(`/seasons/now?${qs({ page, limit })}`),
  getSeason: (year, season, page = 1, limit = 24) => request(`/seasons/${year}/${season}?${qs({ page, limit })}`),
  listAnime: (params) => request(`/anime?${qs(params)}`),
  searchAnime: (q, page = 1, limit = 24, { genres, minScore, year } = {}) => {
    const params = { q, sfw: true, page, limit, min_score: minScore, genres };
    if (year) {
      params.start_date = `${year}-01-01`;
      params.end_date = `${year}-12-31`;
    }
    return request(`/anime?${qs(params)}`);
  },
  async getAnimeDetails(id) {
    const { data } = await request(`/anime/${id}/full`);
    return data;
  },
  getGenres: () => request('/genres/anime'),
  getAnimeByGenre: (genreId, page = 1, limit = 24, order_by = 'score', sort = 'desc') => request(`/anime?${qs({ genres: genreId, page, limit, order_by, sort })}`)
};
