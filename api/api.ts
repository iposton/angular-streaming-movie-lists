let methods: any = {};
let nextTmdbRequestAt = 0;
let tmdbRequestQueue = Promise.resolve();

const scheduleTmdbRequest = async <T>(operation: () => Promise<T>): Promise<T> => {
  let releaseQueue: () => void;
  const previousRequest = tmdbRequestQueue;
  tmdbRequestQueue = new Promise<void>((resolve) => {
    releaseQueue = resolve;
  });

  await previousRequest;

  const delay = Math.max(0, nextTmdbRequestAt - Date.now());
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  nextTmdbRequestAt = Date.now() + 50;
  releaseQueue!();
  return operation();
};

const requestJson = async (url: string, attempt = 0): Promise<any> => {
  const response = await scheduleTmdbRequest(() => fetch(url, {
    signal: AbortSignal.timeout(8000)
  }));

  if (response.status === 429 && attempt < 3) {
    const retryAfter = Number(response.headers.get('retry-after'));
    const retryDelay = Number.isFinite(retryAfter)
      ? retryAfter * 1000
      : 500 * Math.pow(2, attempt);

    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    return requestJson(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`TMDB returned HTTP ${response.status}`);
  }

  return response.json();
};

const createMovieLists = () => ({
    nfMovies: [],
    nfDetails: [],
    nfCredits: [],
    amzMovies: [],
    amzDetails: [],
    amzCredits: [],
    disneyMovies: [],
    disneyDetails: [],
    disneyCredits: [],
    hboMovies: [],
    hboDetails: [],
    hboCredits: [],
    huluMovies: [],
    huluDetails: [],
    huluCredits: [],
    appleMovies: [],
    appleDetails: [],
    appleCredits: [],
    ytMovies: [],
    ytDetails: [],
    ytCredits: [],
    nfTv: [],
    nfTvDetails: [],
    nfTvCredits: [],
    amzTv: [],
    amzTvDetails: [],
    amzTvCredits: [],
    disneyTv: [],
    disneyTvDetails: [],
    disneyTvCredits: [],
    hboTv: [],
    hboTvDetails: [],
    hboTvCredits: [],
    huluTv: [],
    huluTvDetails: [],
    huluTvCredits: [],
    appleTv: [],
    appleTvDetails: [],
    appleTvCredits: []
});

methods.getDate = async () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

methods.getAllMovies = async (year: string, genre: string, provider: string, cat: string, apiKey: string) => {
  const type = cat === 'tv' ? 'tv' : 'movie';
  const selectedYear = /^2[0-6]$/.test(year) ? `20${year}` : '2015';
  const startDate = `${selectedYear}-01-01`;
  const dailyDate = selectedYear === '2026' ? await methods.getDate() : `${selectedYear}-12-31`;
  const providerIds = provider === 'hha'
    ? ['1899', '15', '350']
    : provider === 'nkpkd'
      ? ['175', '337', '293']
      : ['8', '9', '337'];
  const prefixes = provider === 'hha'
    ? ['hbo', 'hulu', 'apple']
    : ['nf', 'amz', 'disney'];
  const mediaSuffix = type === 'tv' ? 'Tv' : 'Movies';
  const output = createMovieLists();
  const apiRoot = 'https://api.themoviedb.org/3';
  const dateFilter = type === 'tv'
    ? `first_air_date.gte=${startDate}&first_air_date.lte=${dailyDate}`
    : `release_date.gte=${startDate}&release_date.lte=${dailyDate}`
  const baseDiscoverParams = `${dateFilter}&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${encodeURIComponent(genre || '')}&with_runtime.gte=0&with_runtime.lte=400`;

  await Promise.all(providerIds.map(async (providerId, index) => {
    const originalLanguage = index === 0 ? 'en' : '';
    const discoverUrl = `${apiRoot}/discover/${type}?api_key=${apiKey}&${baseDiscoverParams}&with_original_language=${originalLanguage}&watch_region=US&with_watch_monetization_types=flatrate&with_watch_providers=${providerId}`;
    const discoverData = await requestJson(discoverUrl);
    const results = Array.isArray(discoverData?.results) ? discoverData.results : [];
    const prefix = prefixes[index];
    const listKey = `${prefix}${mediaSuffix}`;
    const detailsKey = `${prefix}${type === 'tv' ? 'TvDetails' : 'Details'}`;
    const creditsKey = `${prefix}${type === 'tv' ? 'TvCredits' : 'Credits'}`;

    output[listKey] = results;
    const enrichedResults = await Promise.all(results.map(async (item) => {
      const fullDetails = await requestJson(
        `${apiRoot}/${type}/${item.id}?api_key=${apiKey}&language=en-US&append_to_response=credits`
      );
      const { credits = {}, ...details } = fullDetails;

      return {
        details,
        credits: { id: item.id, ...credits }
      };
    }));

    output[detailsKey] = enrichedResults.map((item) => item.details);
    output[creditsKey] = enrichedResults.map((item) => item.credits);
  }));

  return [output];
};

const searchRecommendations = async (id: string, apiKey: string, type: 'movie' | 'tv') => {
  const apiRoot = 'https://api.themoviedb.org/3';
  const [videoData, recommendationData] = await Promise.all([
    requestJson(`${apiRoot}/${type}/${id}/videos?api_key=${apiKey}&language=en-US`),
    requestJson(`${apiRoot}/${type}/${id}/recommendations?api_key=${apiKey}&language=en-US`)
  ]);
  const related = Array.isArray(recommendationData?.results)
    ? recommendationData.results.slice(0, 5)
    : [];
  const enriched = await Promise.all(related.map(async (item) => {
    const [details, credits, providers] = await Promise.all([
      requestJson(`${apiRoot}/${type}/${item.id}?api_key=${apiKey}&language=en-US`),
      requestJson(`${apiRoot}/${type}/${item.id}/credits?api_key=${apiKey}&language=en-US`),
      requestJson(`${apiRoot}/${type}/${item.id}/watch/providers?api_key=${apiKey}`)
    ]);

    return { details, credits, providers };
  }));

  return {
    results: Array.isArray(videoData?.results) ? videoData.results : [],
    related,
    details: enriched.map((item) => item.details),
    credits: enriched.map((item) => item.credits),
    providers: enriched.map((item) => item.providers)
  };
};

methods.search = async (id: string, apiKey: string, cat: string) =>
  searchRecommendations(id, apiKey, cat === 'tv' ? 'tv' : 'movie');

methods.searchtv = async (id: string, apiKey: string) =>
  searchRecommendations(id, apiKey, 'tv');

methods.searchTrending = async (term: string, apiKey: string, cat: string, mode: string = 'title') => {
  const apiRoot = 'https://api.themoviedb.org/3';
  const type = cat === 'tv' ? 'tv' : 'movie';
  const searchMode = mode === 'actor' || mode === 'director' ? mode : 'title';
  const result = { results: [], providers: [], credits: [], person: null };

  const uniqueResults = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      if (item == null || item.id == null || seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  };

  if (searchMode === 'actor' || searchMode === 'director') {
    const peopleData = await requestJson(`${apiRoot}/search/person?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${term}`);
    const people = Array.isArray(peopleData?.results) ? peopleData.results : [];
    const decodedTerm = decodeURIComponent(term).trim().toLowerCase();
    const bestMatch = people.find((person) => person.name?.trim().toLowerCase() === decodedTerm) || people[0];

    if (bestMatch) {
      result.person = bestMatch;
      const creditsPath = type === 'tv' ? 'tv_credits' : 'movie_credits';
      const creditsData = await requestJson(`${apiRoot}/person/${bestMatch.id}/${creditsPath}?api_key=${apiKey}&language=en-US`);
      const matches = searchMode === 'director'
        ? (creditsData?.crew || []).filter((item) => item.poster_path != null && (item.job === 'Director' || type === 'tv' && item.department === 'Directing'))
        : (creditsData?.cast || []).filter((item) => item.poster_path != null);
      result.results = uniqueResults(matches.sort((first, second) => (second.popularity || 0) - (first.popularity || 0))).slice(0, 20);
    }
  } else {
    const searchData = await requestJson(`${apiRoot}/search/${type}?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${term}`);
    result.results = Array.isArray(searchData?.results) ? searchData.results : [];
  }

  const enriched = await Promise.all(result.results.map(async (item) => {
    const [providers, credits] = await Promise.all([
      requestJson(`${apiRoot}/${type}/${item.id}/watch/providers?api_key=${apiKey}`),
      requestJson(`${apiRoot}/${type}/${item.id}/credits?api_key=${apiKey}&language=en-US`)
    ]);
    return { providers, credits };
  }));
  result.providers = enriched.map((item) => item.providers);
  result.credits = enriched.map((item) => item.credits);

  return [result];
};

methods.getTrending = async (apiKey: string) => {
  const apiRoot = 'https://api.themoviedb.org/3';
  const enrich = async (type: 'movie' | 'tv') => {
    const trendingData = await requestJson(`${apiRoot}/trending/${type}/day?api_key=${apiKey}`);
    const items = Array.isArray(trendingData?.results) ? trendingData.results : [];
    const enriched = await Promise.all(items.map(async (item) => {
      const [details, credits, providers] = await Promise.all([
        requestJson(`${apiRoot}/${type}/${item.id}?api_key=${apiKey}&language=en-US`),
        requestJson(`${apiRoot}/${type}/${item.id}/credits?api_key=${apiKey}&language=en-US`),
        requestJson(`${apiRoot}/${type}/${item.id}/watch/providers?api_key=${apiKey}`)
      ]);
      return { details, credits, providers };
    }));

    return {
      items,
      details: enriched.map((item) => item.details),
      credits: enriched.map((item) => item.credits),
      providers: enriched.map((item) => item.providers)
    };
  };

  const [movies, tv] = await Promise.all([enrich('movie'), enrich('tv')]);
  return [{
    movies: movies.items,
    mvDetails: movies.details,
    mvCredits: movies.credits,
    mvProviders: movies.providers,
    tv: tv.items,
    tvDetails: tv.details,
    tvCredits: tv.credits,
    tvProviders: tv.providers
  }];
};

export const api = {data: methods}
