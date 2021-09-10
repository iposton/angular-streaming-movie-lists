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
    disneyCredits: []
  }
]
let mainTv = [
  {
    nfTv: [],
    nfTvDetails: [],
    nfTvCredits: [],
    amzTv: [],
    amzTvDetails: [],
    amzTvCredits: [],
    disneyTv: [],
    disneyTvDetails: [],
    disneyTvCredits: []
  }
]
let searchInfo = [
  {
    results: [],
    related: [],
    details: [],
    credits: []
  }
]
let searchQueryInfo = [
  {
    results: [],
    providers: [],
    credits: []
  }
];

let startDate = '2021-01-01';
let pro1 = "8";
let pro2 = "9";
let pro3 = "235%7C211%7C361%7C363%7C506%7C123";
import { forkJoin } from 'rxjs';

methods.getDate = async () => {
  let utcDate = new Date();
  utcDate.setHours(utcDate.getHours() - 8);
  let myDate = new Date(utcDate);
  return myDate.toISOString().slice(0, 10);
}

methods.getAllMovies = async (year: string, genre: string, provider: string, apiKey: string) => {
  let dailyDate = methods.getDate();
  startDate = year === '21' ?  '2021-01-01' : year === '20' ?  '2020-01-01' : year === '19' ? '2019-01-01' : year === '18' ? '2018-01-01' : year === '17' ? '2017-01-01' : year === '16' ? '2016-01-01' : '2015-01-01';
  dailyDate = year === '21' ? await methods.getDate() : year === '20' ? '2020-12-31' : year === '19' ? '2019-12-31' : year === '18' ? '2018-12-31' : year === '17' ? '2017-12-31' : year === '16' ? '2016-12-31' : '2015-12-31';
 
  if (provider === 'hha') {
    pro1 = "384";
    pro2 = "15";
    pro3 = "350";
  } else if (provider === 'nkpkd') {
    pro1 = "175";
    pro2 = "337";
    pro3 = "293";
  } else if (provider === 'npy') {
    pro1 = "8";
    pro2 = "9";
    pro3 = "235%7C211%7C361%7C363%7C506%7C123"; //YT,FF,TMC,TNT,TBS,FX
  }
  
  let apiRoot = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
  let nfUrl = `${apiRoot}&air_date.gte=&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=en&with_ott_monetization_types=&with_ott_providers=${pro1}&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let amzUrl = `${apiRoot}&air_date.gte=&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=${pro2}&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let dPlusUrl = `${apiRoot}&air_date.gte=&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=${pro3}&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  //air_date.gte=&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=2021-06-02&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=235&with_release_type=&with_runtime.gte=0&with_runtime.lte=400&language=en-US

  let nfPromise = new Promise((resolve, reject) => {
    request(nfUrl, {}, async function(err, res, body) {
      let netflixDetails = [];
      let netflixCredits = [];
      //console.log(body, 'got body');
      if (typeof body !== 'undefined') {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
        let data = JSON.parse(body);
        mainMovies[0]['nfMovies'] = data['results'];
  
        const details = async() => {
          forkJoin(
            data['results'].map( m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixDetails.push(data);
                  if (netflixDetails.length > 1) {
                    return mainMovies[0]['nfDetails'] = netflixDetails;
                  }
                }
              )
            )
          );
        }

        const credits = async() => {
          await details();
          forkJoin(
            data['results'].map( m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixCredits.push(data);
                  if (netflixCredits.length > 1) {
                    mainMovies[0]['nfCredits'] = netflixCredits;
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
        let data = JSON.parse(body);
        mainMovies[0]['amzMovies'] = data['results'];

        async function details() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonDetails.push(data);
                  return mainMovies[0]['amzDetails'] = amazonDetails;
                }
              )
            )
          );
        }

        

        async function credits() {
          await details();
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonCredits.push(data);
                  mainMovies[0]['amzCredits'] = amazonCredits;
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
        let data = JSON.parse(body);
        mainMovies[0]['disneyMovies'] = data['results'];

        async function details() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyDetails.push(data);
                  return (mainMovies[0]['disneyDetails'] = disneyDetails);
                }
              )
            )
          );
        }

        await details();

        async function credits() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyCredits.push(data);
                  return (mainMovies[0]['disneyCredits'] = disneyCredits);
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

methods.getAllTv = async (year: string, genre: string, provider: string, apiKey: string) => {
  let dailyDate = methods.getDate();
  startDate = year === '21' ?  '2021-01-01' : year === '20' ?  '2020-01-01' : year === '19' ? '2019-01-01' : year === '18' ? '2018-01-01' : year === '17' ? '2017-01-01' : year === '16' ? '2016-01-01' : '2015-01-01';
  dailyDate = year === '21' ? await methods.getDate() : year === '20' ? '2020-12-31' : year === '19' ? '2019-12-31' : year === '18' ? '2018-12-31' : year === '17' ? '2017-12-31' : year === '16' ? '2016-12-31' : '2015-12-31';
  
  if (provider === 'hha') {
    pro1 = "384";
    pro2 = "15";
    pro3 = "350";
  } else if (provider === 'nkpkd') {
    pro1 = "175";
    pro2 = "337";
    pro3 = "293"
  } else if (provider === 'npy') {
    pro1 = "8";
    pro2 = "9";
    pro3 = "79%7C211%7C363%7C506%7C148%7C209%7C397%7C403"; //NBC,FF,TNT,TBS,ABC,PBS,BBC,DISC
  }

  let apiRoot = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}`;
  let nfUrl = `${apiRoot}&air_date.gte=${startDate}&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=${pro1}&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let amzUrl = `${apiRoot}&air_date.gte=${startDate}&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=${pro2}&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let dPlusUrl = `${apiRoot}&air_date.gte=${startDate}&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=${pro3}&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
   //`${apiRoot}&air_date.gte=&air_date.lte=2021-06-02&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres${genre}=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=${pro3}&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;

  let nfPromise = new Promise((resolve, reject) => {
    request(nfUrl, {}, async function(err, res, body) {
      let netflixDetails = [];
      let netflixCredits = [];
      //console.log(body, 'got body');
      if (typeof body !== 'undefined') {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
        let data = JSON.parse(body);
        mainTv[0]['nfTv'] = data['results'];
        const details = async () => {
          forkJoin(
            data['results'].map( m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixDetails.push(data);
                  if (netflixDetails.length > 1) {
                    return mainTv[0]['nfTvDetails'] = netflixDetails;
                  }
                }
              )
            )
          );
        }

        const credits = async () => {
          
          await details();
          forkJoin(
            data['results'].map( m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixCredits.push(data);
                  if (netflixCredits.length > 1) {
                    mainTv[0]['nfTvCredits'] = netflixCredits;
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
        //resolve('done');
      }
    });
  });

  let amzPromise = new Promise((resolve, reject) => {
    request(amzUrl, {}, async function(err, res, body) {
      let amazonDetails = [];
      let amazonCredits = [];

      if (typeof body !== 'undefined') {
        let data = JSON.parse(body);
        mainTv[0]['amzTv'] = data['results'];

        async function details() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonDetails.push(data);
                  return (mainTv[0]['amzTvDetails'] = amazonDetails);
                }
              )
            )
          );
        }

        await details();

        async function credits() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonCredits.push(data);
                  return (mainTv[0]['amzTvCredits'] = amazonCredits);
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

  let dPromise = new Promise((resolve, reject) => {
    request(dPlusUrl, {}, async function(err, res, body) {
      let disneyDetails = [];
      let disneyCredits = [];

      if (typeof body !== 'undefined') {
        let data = JSON.parse(body);
        mainTv[0]['disneyTv'] = data['results'];

        async function details() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyDetails.push(data);
                  return (mainTv[0]['disneyTvDetails'] = disneyDetails);
                }
              )
            )
          );
        }

        await details();

        async function credits() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/tv/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyCredits.push(data);
                  return (mainTv[0]['disneyTvCredits'] = disneyCredits);
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
  return mainTv;
};



methods.search = async (id: string, apiKey: string) => {
  let apiUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`;
  let recUrl = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&language=en-US`;
  let searchPromise = new Promise((resolve, reject) => {
    request(apiUrl, {}, function(err, res, body) {
      let data = JSON.parse(body);
      searchInfo[0].results = data['results'];
      resolve('done');
    });
  });

  let relatedPromise = new Promise((resolve, reject) => {
    let relatedDetails = [];
    let relatedCredits = [];
    request(recUrl, {}, function(err, res, body) {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      let data = JSON.parse(body);
      let results = data['results'];
      if (results.length > 5)
        results.length = 5;
      searchInfo[0].related = results;
      const details = async () => {
        forkJoin(
          results.map( m =>
            request(
              `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
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
          results.map( m =>
            request(
              `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
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
    request(apiUrl, {}, function(err, res, body) {
      let data = JSON.parse(body);
      searchInfo[0].results = data['results'];
      resolve('done');
    });
  });

  let relatedPromise = new Promise((resolve, reject) => {
    let relatedDetails = [];
    let relatedCredits = [];
    request(recUrl, {}, function(err, res, body) {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      let data = JSON.parse(body);
      searchInfo[0].related = data['results'];
      let results = data['results'];
      if (results.length > 5)
        results.length = 5;
      searchInfo[0].related = results;
      const details = async () => {
        forkJoin(
          results.map( m =>
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
          results.map( m =>
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

methods.searchTrending = async (term: string, apiKey: string, cat: string) => {
  //let searchQuery = `https://www.themoviedb.org/search/trending?language=en-US&query=${term}`;
  let type = cat === 'tv' ? 'tv' : 'movie'
  let searchQuery = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${term}`;
  let searchPromise = new Promise((resolve, reject) => {
    request(searchQuery, {}, function(err, res, body) {
      let mvProviders = []
      let mvCredits = []
      if (typeof body !== 'undefined') {
          const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
          let data = JSON.parse(body)
          searchQueryInfo[0]['results'] = data['results']

          const providers = async() => {
            forkJoin(
              data['results'].map( m =>
                request(
                  `https://api.themoviedb.org/3/${type}/${m.id}/watch/providers?api_key=${apiKey}`,
                  {},
                  async function(err, res, body) {
                    let data = await JSON.parse(body);
                    mvProviders.push(data);
                    if (mvProviders.length > 1) {
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
              data['results'].map( m =>
                request(
                  `https://api.themoviedb.org/3/${type}/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                  {},
                  async function(err, res, body) {
                    let data = await JSON.parse(body);
                    mvCredits.push(data);
                    if (mvCredits.length > 1) {
                      searchQueryInfo[0]['credits'] = mvCredits;         
                    }
                  }
                )
              )
            );
            await sleep(1500);
            resolve('done');
          }
        credits() 
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
        let data = JSON.parse(body);
        trending[0]['movies'] = data['results'];

        const providers = async() => {
          forkJoin(
            data['results'].map( m =>
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
            data['results'].map( m =>
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
            data['results'].map( m =>
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
        let data = JSON.parse(body);
        trending[0]['tv'] = data['results'];

        const providers = async() => {
          forkJoin(
            data['results'].map( m =>
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
            data['results'].map( m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
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
            data['results'].map( m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
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
          );
          await sleep(500);
          resolve('done');
        }
        credits();
      }
    });
  });

  let result = await mvPromise;
  let result2 = await tvPromise;

  return trending;
};

export const api = {data: methods};
