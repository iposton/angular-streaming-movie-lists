let request = require('request');
let methods: any = {};
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

let mainMovies = [
  {
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
  }
]

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

let startDate = '2021-01-01';
let pro1 = "8"
let pro2 = "9"
let pro3 = "337" //"235%7C211%7C361%7C363%7C506%7C123";
let name1 = "nfMovies"
let name2 = "amzMovies"
let name3 = "disneyMovies"
let dets1 = "nfDetails"
let dets2 = "amzDetails"
let dets3 = "disneyDetails"
let creds1 = "nfCredits"
let creds2 = "amzCredits"
let creds3 = "disneyCredits"
import { forkJoin } from 'rxjs';

methods.getDate = async () => {
  let utcDate = new Date();
  utcDate.setHours(utcDate.getHours() - 8);
  let myDate = new Date(utcDate);
  return myDate.toISOString().slice(0, 10);
}

methods.getAllMovies = async (year: string, genre: string, provider: string, cat: string, apiKey: string) => {
  let type = cat === 'tv' ? 'tv' : 'movie'
  let dailyDate = methods.getDate()
  startDate = year === '26' ? '2026-01-01' : year === '25' ? '2025-01-01' : year === '24' ? '2024-01-01' : year === '23' ? '2023-01-01' : year === '22' ? '2022-01-01' : year === '21' ? '2021-01-01' : year === '20' ? '2020-01-01' : year === '19' ? '2019-01-01' : year === '18' ? '2018-01-01' : year === '17' ? '2017-01-01' : year === '16' ? '2016-01-01' : '2015-01-01';
  dailyDate = year === '26' ? await methods.getDate() : year === '25' ? '2025-12-31' : year === '24' ? '2024-12-31' : year === '23' ? '2023-12-31' : year === '22' ? '2022-12-31' : year === '21' ? '2021-12-31' : year === '20' ? '2020-12-31' : year === '19' ? '2019-12-31' : year === '18' ? '2018-12-31' : year === '17' ? '2017-12-31' : year === '16' ? '2016-12-31' : '2015-12-31';
 
  if (type === 'movie') {
    if (provider === 'hha') {
      pro1 = "1899"
      name1 = "hboMovies"
      dets1 = "hboDetails"
      creds1 = "hboCredits"
      pro2 = "15"
      name2 = "huluMovies"
      dets2 = "huluDetails"
      creds2 = "huluCredits"
      pro3 = "350"
      name3 = "appleMovies"
      dets3 = "appleDetails"
      creds3 = "appleCredits"
    } else if (provider === 'nkpkd') {
      pro1 = "175";
      pro2 = "337";
      pro3 = "293";
    } else if (provider === 'npy') {
      pro1 = "8"
      name1 = "nfMovies"
      dets1 = "nfDetails"
      creds1 = "nfCredits"
      pro2 = "9"
      name2 = "amzMovies"
      dets2 = "amzDetails"
      creds2 = "amzCredits"
      pro3 = "337" //"235%7C211%7C361%7C363%7C506%7C123" //YT,FF,TMC,TNT,TBS,FX
      name3 = "disneyMovies"
      dets3 = "disneyDetails"
      creds3 = "disneyCredits"
      mainMovies[0].hboMovies = []
      mainMovies[0].hboDetails = []
      mainMovies[0].hboCredits = []
      mainMovies[0].huluMovies = []
      mainMovies[0].huluDetails = []
      mainMovies[0].huluCredits = []
      mainMovies[0].appleMovies = []
      mainMovies[0].appleDetails = []
      mainMovies[0].appleCredits = []
    }
  }

  if (type === 'tv') {
    if (provider === 'hha') {
      pro1 = "1899" //384"
      name1 = "hboTv"
      dets1 = "hboTvDetails"
      creds1 = "hboTvCredits"
      pro2 = "15"
      name2 = "huluTv"
      dets2 = "huluTvDetails"
      creds2 = "huluTvCredits"
      pro3 = "350"
      name3 = "appleTv"
      dets3 = "appleTvDetails"
      creds3 = "appleTvCredits"
    } else if (provider === 'nkpkd') {
      pro1 = "175";
      pro2 = "337";
      pro3 = "293";
    } else if (provider === 'npy') {
      pro1 = "8"
      name1 = "nfTv"
      dets1 = "nfTvDetails"
      creds1 = "nfTvCredits"
      pro2 = "9"
      name2 = "amzTv"
      dets2 = "amzTvDetails"
      creds2 = "amzTvCredits"
      pro3 = "337" //"235%7C211%7C361%7C363%7C506%7C123" //YT,FF,TMC,TNT,TBS,FX
      name3 = "disneyTv"
      dets3 = "disneyTvDetails"
      creds3 = "disneyTvCredits"
      mainMovies[0].hboTv = []
      mainMovies[0].hboTvDetails = []
      mainMovies[0].hboTvCredits = []
      mainMovies[0].huluTv = []
      mainMovies[0].huluTvDetails = []
      mainMovies[0].huluTvCredits = []
      mainMovies[0].appleTv = []
      mainMovies[0].appleTvDetails = []
      mainMovies[0].appleTvCredits = []
    }
  }
  
  
  let apiRoot = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}`
  const dateFilter = type === 'tv'
    ? `first_air_date.gte=${startDate}&first_air_date.lte=${dailyDate}`
    : `release_date.gte=${startDate}&release_date.lte=${dailyDate}`
  const providerFilter = `watch_region=US&with_watch_monetization_types=flatrate&with_watch_providers=`
  const baseDiscoverParams = `${dateFilter}&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_runtime.gte=0&with_runtime.lte=400`
  let nfUrl = `${apiRoot}&${baseDiscoverParams}&with_original_language=en&${providerFilter}${pro1}`;
  let amzUrl = `${apiRoot}&${baseDiscoverParams}&with_original_language=&${providerFilter}${pro2}`;
  let dPlusUrl = `${apiRoot}&${baseDiscoverParams}&with_original_language=&${providerFilter}${pro3}`;

  let nfPromise = new Promise((resolve, reject) => {
    request(nfUrl, {}, async function(err, res, body) {
      let netflixDetails = [];
      let netflixCredits = [];
      //console.log(body, 'got body');
      if (typeof body !== 'undefined') {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
        let data = await JSON.parse(body);
        mainMovies[0][`${name1}`] = data['results'];
  
        const details = async() => {
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/${type}/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixDetails.push(data);
                  if (netflixDetails.length > 1) {
                    return mainMovies[0][`${dets1}`] = netflixDetails;
                  }
                }
              )
            )
          );
        }

        const credits = async() => {
          await details();
          forkJoin(
            data['results']?.map( m =>
              request(
                `https://api.themoviedb.org/3/${type}/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixCredits.push(data);
                  if (netflixCredits.length > 1) {
                    mainMovies[0][`${creds1}`] = netflixCredits;
                    //let result = await Promise.resolve(netflixCredits);
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

  let amzPromise = new Promise((resolve, reject) => {
    request(amzUrl, {}, async function(err, res, body) {
      let amazonDetails = [];
      let amazonCredits = [];

      if (typeof body !== 'undefined') {
        let data = await JSON.parse(body);
        mainMovies[0][`${name2}`] = data['results'];

        const details = async function() {
          forkJoin(
            data['results']?.map(async m =>
              request(
                `https://api.themoviedb.org/3/${type}/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonDetails.push(data);
                  return mainMovies[0][`${dets2}`] = amazonDetails;
                }
              )
            )
          );
        }

        const credits = async function() {
          await details();
          forkJoin(
            data['results']?.map(async m =>
              request(
                `https://api.themoviedb.org/3/${type}/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonCredits.push(data);
                  mainMovies[0][`${creds2}`] = amazonCredits;
                }
              )
            )
          );
          resolve('done');
        }
        credits();  
      }
    });
  });

  let dPromise = new Promise((resolve, reject) => {
    request(dPlusUrl, {}, async function(err, res, body) {
      let disneyDetails = [];
      let disneyCredits = [];

      if (typeof body !== 'undefined') {
        let data = await JSON.parse(body);
        mainMovies[0][`${name3}`] = data['results'];

        const details = async function() {
          forkJoin(
            data['results']?.map(async m =>
              request(
                `https://api.themoviedb.org/3/${type}/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyDetails.push(data);
                  return (mainMovies[0][`${dets3}`] = disneyDetails);
                }
              )
            )
          );
        }

        await details();

        const credits = async function() {
          forkJoin(
            data['results']?.map(async m =>
              request(
                `https://api.themoviedb.org/3/${type}/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyCredits.push(data);
                  return (mainMovies[0][`${creds3}`] = disneyCredits);
                }
              )
            )
          );
        }

        await credits();
        resolve('done');
      }
    });
  });

  let result = await nfPromise;
  let result2 = await amzPromise;
  let result3 = await dPromise;
  return mainMovies;
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
