//
// LIRI is a _Language_ Interpretation and Recognition Interface
//

//set any environment variables
require("dotenv").config();
// require modules
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');


var cmd = process.argv[2];
// concatenate all arguments to build search topic
var searchTopic = process.argv.slice(3).join('+');;

// Process commands
switch (cmd) {
  case 'concert-this':
    // node liri.js concert-this <artist/band name here>
    console.log("concert-this");
    console.log(searchTopic);
    break;
  case 'spotify-this-song':
    // node liri.js spotify-this-song '<song name here>'
    console.log("spotify-this-song");
    console.log(searchTopic);
    spotifySong(searchTopic);
    break;
  case 'movie-this':
    // node liri.js movie-this '<movie name here>'
    console.log("movie-this");
    console.log(searchTopic);
    break;
  case 'do-what-it-says':
    // node liri.js do-what-it-says
    console.log("do-what-it-says");
    console.log(searchTopic);
    break;
  default:
    console.log("invalid command");
    break;
}



function spotifySong(searchTopic) {
  // Default song, if nothing was provided
  if (searchTopic === '') searchTopic = 'The Sign';
  // access keys information
  var spotify = new Spotify(keys.spotify);

  spotify
    .search({
      type: 'track',
      query: searchTopic
    })
    .then(function (response) {
      
      // * Artist(s)
      // * The song's name
      // * A preview link of the song from Spotify
      // * The album that the song is from
      
      console.log(response);

      // var tracks = response.tracks;
      // console.log(tracks);

      // for (const key in tracks) {
      //   if (tracks.hasOwnProperty(key)) {
      //     const element = tracks[key];
      //     console.log(element);
      //     // console.log(element.artists);
      //     // console.log(element.name);
      //     // console.log(element.href);
      //   }
      // }

    })
    .catch(function (err) {
      console.log(err);
    });

}