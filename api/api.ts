let request = require('request');
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

let trending = [
  {
    movies: [],
    mvDetails: [],
    mvCredits: [],
    mvProviders: [],
    tv: [],
    tvDetails: [],
    tvCredits: [],
    tvProviders: [],
  }
]

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

let searchInfo = [
  {
    results: [],
    related: [],
    details: [],
    credits: [],
    providers: []
  }
]

let searchQueryInfo = [
  {
    results: [],
    providers: [],
    credits: [],
    person: null
  }
];

import { forkJoin } from 'rxjs';

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

  const requestJson = async (url: string, attempt = 0): Promise<any> =>
    scheduleTmdbRequest(() => new Promise((resolve, reject) => {
      request(url, { json: true, timeout: 8000 }, (err, response, body) => {
        if (err) {
          reject(err);
          return;
        }

        if (response?.statusCode === 429 && attempt < 3) {
          const retryAfter = Number(response.headers?.['retry-after']);
          const retryDelay = Number.isFinite(retryAfter)
            ? retryAfter * 1000
            : 500 * Math.pow(2, attempt);

          setTimeout(() => {
            requestJson(url, attempt + 1).then(resolve, reject);
          }, retryDelay);
          return;
        }

        if (!response || response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`TMDB returned HTTP ${response?.statusCode || 'unknown'}`));
          return;
        }

        resolve(body);
      });
    }));

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

methods.search = async (id: string, apiKey: string, cat: string) => {
  let type = cat === 'tv' ? 'tv' : 'movie'
  let apiUrl = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`;
  let recUrl = `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${apiKey}&language=en-US`;
  let searchPromise = new Promise((resolve, reject) => {
    request(apiUrl, {}, async function(err, res, body) {
      let data = await JSON.parse(body);
      searchInfo[0].results = data['results'];
      resolve('done');
    });
  });

  let relatedPromise = new Promise((resolve, reject) => {
    let relatedDetails = []
    let relatedCredits = []
    let mvProviders = []
    request(recUrl, {}, async function(err, res, body) {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      let data = await JSON.parse(body);
      let results = data['results'];
      if (results.length > 5)
        results.length = 5;
      searchInfo[0].related = results;

      const providers = async() => {
        forkJoin(
          data['results']?.map( m =>
            request(
              `https://api.themoviedb.org/3/${type}/${m.id}/watch/providers?api_key=${apiKey}`,
              {},
              async function(err, res, body) {
                let data = await JSON.parse(body);
                mvProviders.push(data);
                if (mvProviders.length > 1) {
                  return searchInfo[0]['providers'] = mvProviders;
                }
              }
            )
          )
        )  
      }

      const details = async () => {
        await providers();
        forkJoin(
          results?.map( m =>
            request(
              `https://api.themoviedb.org/3/${type}/${m.id}?api_key=${apiKey}&language=en-US`,
              {},
              async function(err, res, body) {
                let data = await JSON.parse(body);
                relatedDetails.push(data);
                if (relatedDetails.length > 1) {
                  return searchInfo[0]['details'] = relatedDetails;
                }
              }
            )
          )
        );
      }

      const credits = async () => {
        
        await details();
        forkJoin(
          results?.map( m =>
            request(
              `https://api.themoviedb.org/3/${type}/${m.id}/credits?api_key=${apiKey}&language=en-US`,
              {},
              async function(err, res, body) {
                let data = await JSON.parse(body);
                relatedCredits.push(data);
                if (relatedCredits.length > 1) {
                  searchInfo[0]['credits'] = relatedCredits;
                  //let result = await Promise.resolve(netflixCredits);
                }
              }
            )
          )
        );
        await sleep(500);
        resolve('done');
      }
      credits();
    });
  });

  let result = await searchPromise;
  let result2 = await relatedPromise;
  return searchInfo[0];
};

methods.searchtv = async (id: string, apiKey: string) => {
  let apiUrl = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-US`;
  let recUrl = `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${apiKey}&language=en-US`;
  let searchPromise = new Promise((resolve, reject) => {
    request(apiUrl, {}, async function(err, res, body) {
      let data = await JSON.parse(body);
      searchInfo[0].results = data['results'];
      resolve('done');
    });
  });

  let relatedPromise = new Promise((resolve, reject) => {
    let relatedDetails = [];
    let relatedCredits = [];
    request(recUrl, {}, async function(err, res, body) {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      let data = await JSON.parse(body);
      searchInfo[0].related = data['results'];
      let results = data['results'];
      if (results.length > 5)
        results.length = 5;
      searchInfo[0].related = results;
      const details = async () => {
        forkJoin(
          results?.map( m =>
            request(
              `https://api.themoviedb.org/3/tv/${m.id}?api_key=${apiKey}&language=en-US`,
              {},
              async function(err, res, body) {
                let data = await JSON.parse(body);
                relatedDetails.push(data);
                if (relatedDetails.length > 1) {
                  return searchInfo[0]['details'] = relatedDetails;
                }
              }
            )
          )
        );
      }

      const credits = async () => {
        
        await details();
        forkJoin(
          results?.map( m =>
            request(
              `https://api.themoviedb.org/3/tv/${m.id}/credits?api_key=${apiKey}&language=en-US`,
              {},
              async function(err, res, body) {
                let data = await JSON.parse(body);
                relatedCredits.push(data);
                if (relatedCredits.length > 1) {
                  searchInfo[0]['credits'] = relatedCredits;
                  //let result = await Promise.resolve(netflixCredits);
                }
              }
            )
          )
        );
        await sleep(500);
        resolve('done');
      }
      credits();
      //resolve('done');
    });
  });

  let result = await searchPromise;
  let result2 = await relatedPromise;
  return searchInfo[0];
};

methods.searchTrending = async (term: string, apiKey: string, cat: string, mode: string = 'title') => {
  //let searchQuery = `https://www.themoviedb.org/search/trending?language=en-US&query=${term}`;
  let type = cat === 'tv' ? 'tv' : 'movie'
  let searchMode = mode === 'actor' || mode === 'director' ? mode : 'title'
  searchQueryInfo[0] = {
    results: [],
    providers: [],
    credits: [],
    person: null
  };

  const uniqueResults = (items) => {
    let seen = new Set();
    return items.filter((item) => {
      if (item == null || item.id == null || seen.has(item.id)) {
        return false;
      }

      seen.add(item.id);
      return true;
    });
  };

  const enrichResults = async (items) => {
    let mvProviders = [];
    let mvCredits = [];

    if (!items.length) {
      return searchQueryInfo;
    }

    let enrichPromise = new Promise((resolve, reject) => {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      const providers = async() => {
        forkJoin(
          items.map( m =>
            request(
              `https://api.themoviedb.org/3/${type}/${m.id}/watch/providers?api_key=${apiKey}`,
              {},
              async function(err, res, body) {
                let data = await JSON.parse(body);
                mvProviders.push(data);
                if (mvProviders.length > 1 || items.length === 1) {
                  return searchQueryInfo[0]['providers'] = mvProviders;
                }
              }
            )
          )
        )  
      }

      const credits = async() => {
        await providers();

        forkJoin(
          items.map( m =>
            request(
              `https://api.themoviedb.org/3/${type}/${m.id}/credits?api_key=${apiKey}&language=en-US`,
              {},
              async function(err, res, body) {
                let data = await JSON.parse(body);
                mvCredits.push(data);
                if (mvCredits.length > 1 || items.length === 1) {
                  searchQueryInfo[0]['credits'] = mvCredits;         
                }
              }
            )
          )
        );
        await sleep(1500);
        resolve('done');
      }

      credits();
    });

    await enrichPromise;
    return searchQueryInfo;
  };

  if (searchMode === 'actor' || searchMode === 'director') {
    let personSearchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${term}`;
    let personCreditsPath = type === 'tv' ? 'tv_credits' : 'movie_credits';

    let actorPromise = new Promise((resolve, reject) => {
      request(personSearchUrl, {}, async function(err, res, body) {
        if (typeof body === 'undefined') {
          return resolve('done');
        }

        let data = await JSON.parse(body);
        let people = data['results'] || [];
        let decodedTerm = decodeURIComponent(term).trim().toLowerCase();
        let bestMatch = people.find((person) => person.name != null && person.name.trim().toLowerCase() === decodedTerm) || people[0];

        if (bestMatch == null) {
          searchQueryInfo[0]['results'] = [];
          return resolve('done');
        }

        searchQueryInfo[0]['person'] = bestMatch;

        request(
          `https://api.themoviedb.org/3/person/${bestMatch.id}/${personCreditsPath}?api_key=${apiKey}&language=en-US`,
          {},
          async function(err, res, creditsBody) {
            if (typeof creditsBody === 'undefined') {
              searchQueryInfo[0]['results'] = [];
              return resolve('done');
            }

            let creditsData = await JSON.parse(creditsBody);
            let matchedCredits = searchMode === 'director'
              ? (creditsData['crew'] || []).filter((item) => {
                  if (type === 'tv') {
                    return item.poster_path != null && (item.department === 'Directing' || item.job === 'Director');
                  }

                  return item.poster_path != null && item.job === 'Director';
                })
              : (creditsData['cast'] || []).filter((item) => item.poster_path != null);

            let credits = uniqueResults(matchedCredits
              .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            );

            if (credits.length > 20) {
              credits.length = 20;
            }

            searchQueryInfo[0]['results'] = credits;
            await enrichResults(credits);
            resolve('done');
          }
        );
      })
    });

    await actorPromise;
    return searchQueryInfo;
  }

  let searchQuery = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${term}`;
  let searchPromise = new Promise((resolve, reject) => {
    request(searchQuery, {}, async function(err, res, body) {
      if (typeof body !== 'undefined') {
          let data = await JSON.parse(body)
          searchQueryInfo[0]['results'] = data['results']
          await enrichResults(data['results'] || []);
          resolve('done');
      }
    })
  })
  let result = await searchPromise;
  return searchQueryInfo;
}

methods.getTrending = async (apiKey: string) => {
  let apiRootMV = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
  let apiRootTV = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;

  let mvPromise = new Promise((resolve, reject) => {
    request(apiRootMV, {}, async function(err, res, body) {
      let mvDetails = [];
      let mvCredits = [];
      let mvProviders = [];
      //console.log(body, 'got body');
      if (typeof body !== 'undefined') {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
        let data = await JSON.parse(body);
        trending[0]['movies'] = data['results'];

        const providers = async() => {
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/watch/providers?api_key=${apiKey}`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  mvProviders.push(data);
                  if (mvProviders.length > 1) {
                    return trending[0]['mvProviders'] = mvProviders;
                  }
                }
              )
            )
          )
        }
  
        const details = async() => {
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  mvDetails.push(data);
                  if (mvDetails.length > 1) {
                    return trending[0]['mvDetails'] = mvDetails;
                  }
                }
              )
            )
          );
        }

        const credits = async() => {
          await providers();
          await details();
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  mvCredits.push(data);
                  if (mvCredits.length > 1) {
                    trending[0]['mvCredits'] = mvCredits;         
                  }
                }
              )
            )
          );
          await sleep(1500);
          resolve('done');
        }
        credits();
      }
    });
  });

  let tvPromise = new Promise((resolve, reject) => {
    request(apiRootTV, {}, async function(err, res, body) {
      let tvDetails = [];
      let tvCredits = [];
      let tvProviders = [];
      //console.log(body, 'got body');
      if (typeof body !== 'undefined') {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
        let data = await JSON.parse(body);
        trending[0]['tv'] = data['results'];

        const providers = async() => {
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}/watch/providers?api_key=${apiKey}`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  tvProviders.push(data);
                  if (tvProviders.length > 1) {
                    return trending[0]['tvProviders'] = tvProviders;
                  }
                }
              )
            )
          );
        }
  
        const details = async() => {
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  tvDetails.push(data);
                  if (tvDetails.length > 1) {
                    return trending[0]['tvDetails'] = tvDetails;
                  }
                }
              )
            )
          );
        }

        const credits = async() => {
          await providers();
          await details();
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  tvCredits.push(data);
                  if (tvCredits.length > 1) {
                    trending[0]['tvCredits'] = tvCredits;         
                  }
                }
              )
            )
          )
          await sleep(2500)
          resolve('done')
        }
        credits()
      }
    });
  });

  let result = await mvPromise
  let result2 = await tvPromise

  return trending
};

export const api = {data: methods}
