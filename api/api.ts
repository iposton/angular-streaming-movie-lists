let request = require('request');
let methods: any = {};
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
];
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
];
let searchInfo = [
  {
    results: [],
    related: [],
    details: [],
    credits: []
  }
];

let startDate = '2020-01-01';
import { forkJoin } from 'rxjs';

methods.getDate = async () => {
  let utcDate = new Date();
  utcDate.setHours(utcDate.getHours() - 8);
  let myDate = new Date(utcDate);
  return myDate.toISOString().slice(0, 10);
}

methods.getAllMovies = async (year: string, genre: string, apiKey: string) => {
  let dailyDate = methods.getDate();
  startDate = year === '20' ?  '2020-01-01' : '2019-01-01';
  dailyDate = year === '20' ? await methods.getDate() : '2019-12-31';
  let apiRoot = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
  let nfUrl = `${apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=en&with_ott_monetization_types=&with_ott_providers=8&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let amzUrl = `${apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=9&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let dPlusUrl = `${apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=337&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;

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
          resolve();
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
          resolve();
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
        resolve();
      }
    });
  });

  let result = await nfPromise;
  let result2 = await amzPromise;
  let result3 = await dPromise;
  return mainMovies;
};

methods.getAllTv = async (year: string, genre: string, apiKey: string) => {
  let dailyDate = methods.getDate();
  startDate = year === '20' ?  '2020-01-01' : '2019-01-01';
  dailyDate = year === '20' ? await methods.getDate() : '2019-12-31';
  let apiRoot = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}`;
  let nfUrl = `${apiRoot}&air_date.gte=${startDate}&air_date.lte=2020-05-13&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=8&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let amzUrl = `${apiRoot}&air_date.gte=${startDate}&air_date.lte=2020-05-13&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=${genre}&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=9&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let dPlusUrl = `${apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=${startDate}&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres${genre}=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=337&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;

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
          resolve();
        }
        credits();
        //resolve();
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
        resolve();
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
        resolve();
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
      resolve();
    });
  });

  let relatedPromise = new Promise((resolve, reject) => {
    let relatedDetails = [];
    let relatedCredits = [];
    request(recUrl, {}, function(err, res, body) {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      let data = JSON.parse(body);
      let results = data['results'];
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
        resolve();
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
      resolve();
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
        resolve();
      }
      credits();
      //resolve();
    });
  });

  let result = await searchPromise;
  let result2 = await relatedPromise;
  return searchInfo[0];
};

exports.data = methods;
