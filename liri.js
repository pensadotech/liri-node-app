//
// LIRI is a _Language_ Interpretation and Recognition Interface
//

// require modules ........................................................
//set any environment variables
require("dotenv").config();
// prepare modules
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const fs = require("fs");

// Process command using parameters .......................................
if (process.argv.length < 3) {
  console.log("missing argument: command (e.g. node liri movie-this ....) ")
} else {
  var actionCmd = process.argv[2];
  var searchTopic = '';
  // concatenate all arguments to build search topic
  if (process.argv.length >= 4) {
    searchTopic = process.argv.slice(3).join('+');
  }
  console.log("actionCmd: " + actionCmd);
  console.log("searchTopic: " + searchTopic);
  // Process commands
  takeAction(actionCmd, searchTopic);
}



// Functions ..............................................................
function takeAction(actionCmd, searchTopic) {
  // Process commands
  switch (actionCmd) {
    case 'concert-this':
      // node liri.js concert-this <artist/band name here>
      // execute command
      concertThis(searchTopic);
      break;
    case 'spotify-this-song':
      // node liri.js spotify-this-song '<song name here>'
      // execute command
      spotifySong(searchTopic.trim());
      break;
    case 'movie-this':
      // node liri.js movie-this '<movie name here>'
      // execute command
      movieThis(searchTopic.trim());
      break;
    case 'do-what-it-says':
      // node liri.js do-what-it-says
      // execute acction 
      doWhatItSay();
      break;
    default:
      console.log("invalid command");
      break;
  }
}

function concertThis(searchTopic) {

  // * Name of the venue
  // * Venue location
  // * Date of the Event (use moment to format this as "MM/DD/YYYY")

  // Look for the band
  if (searchTopic === '') {
    console.log("Invalid band entry!");
  } else {
    // example: "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    let url = 'https://rest.bandsintown.com/artists/';
    url += searchTopic;
    url += '/events?app_id=codingbootcamp';
    // Request infromaiton
    request(url, function (err, response, body) {
      if (err) {
        console.log(err);
      } else {
        // prepare resonse
        let data = JSON.parse(body);
        let venueNum = 0;
        // target band
        console.log("Band Requested: " + searchTopic);
        writteToLogFile("Band Requested: " + searchTopic);
        // Load each venue
        data.forEach(element => {
          // Display data
          console.log('Venue# : ' + venueNum);
          console.log('Name of the venue : ' + element.venue.name);
          console.log('Venue location : ' + element.venue.city + ', ' + element.venue.country);
          console.log('Date of the Event : ' + moment(element.datetime).format("MM/DD/YYYY HH:MM"));
          console.log('-------------------------------------');
          let venueData = `
           Venue# : ${venueNum}
           Name of the venue : ${element.venue.name}
           Venue location : ${element.venue.city}, ${element.venue.country}
           Date of the Event : ${moment(element.datetime).format("MM/DD/YYYY HH:MM")}
           ---------------------------------------------
           `
          // write in log file
          writteToLogFile(venueData);
          venueNum++;
        });
      }
    })
  }
}

function spotifySong(searchTopic) {
  // Default search topic, if nothing was provided
  if (searchTopic === '') searchTopic = 'The Sign';
  // access keys information
  var spotify = new Spotify(keys.spotify);

  // * Artist(s)
  // * The song's name
  // * A preview link of the song from Spotify
  // * The album that the song is from

  // ref Article: https://stackoverflow.com/questions/34909680/strange-response-from-spotify-api-using-node-js
  spotify
    .search({
      type: 'track',
      query: searchTopic
    })
    .then(function (response) {
      // JSON-TO-STRING
      // console.log(JSON.stringify(response));
      let songNum = 0;
      // target song 
      console.log("Song Requested: " + searchTopic);
      writteToLogFile("Song Requested: " + searchTopic);
      // get information from returned structure
      response.tracks.items.forEach(songInfo => {
        // find artists list
        let artistLst = '';
        for (let i = 0; i < songInfo.artists.length; i++) {
          if (i === 0) {
            artistLst = songInfo.artists[i].name;
          } else {
            artistLst = artistLst + ',' + songInfo.artists[i].name;
          }
        }
        // Display data 
        console.log('Song Info# : ' + songNum);
        console.log('Artists : ' + artistLst);
        console.log('Name : ' + songInfo.name);
        console.log('Preview url : ' + songInfo.preview_url);
        console.log('Album : ' + songInfo.album.name);
        console.log('Popularity : ' + songInfo.popularity);
        consloe.log('.................................................')
        let songData = `
        Song Info# : ${songNum}
        Artists : ${artistLst}
        Name : ${songInfo.name}
        Preview url : ${songInfo.preview_url}
        Album : ${songInfo.album.name}
        Popularity : ${songInfo.popularity}
        ------------------------------------------------
        `
        writteToLogFile(songData);
        songNum++;
      });

    })
    .catch(function (err) {
      console.log(err);
    });

}

function movieThis(searchTopic) {
  // Default search topic, if nothing was provided
  if (searchTopic === '') searchTopic = 'Mr. Nobody';

  // * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.

  // Look for the movie
  // example: http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy
  let url = 'http://www.omdbapi.com/';
  url += '?t=' + searchTopic;
  url += '&y=&plot=short';
  url += '&apikey=trilogy';

  request(url, function (err, response, body) {
    if (err) {
      console.log(err);
    } else {
      // string-to-JSON
      let data = JSON.parse(body);
      // console.log(data);
      if (data.Title === undefined) {
        console.log('Movie not found!');
      } else {
        // get Rotten Tomatoes rating
        let rottenTommatoes = '';
        data.Ratings.forEach(element => {
          if (element.Source === 'Rotten Tomatoes') {
            rottenTommatoes = element.Value;
          }
        });
        // target song 
        console.log("Movie Requested: " + searchTopic);
        writteToLogFile("Movie Requested: " + searchTopic);
        // display the required info in console
        console.log('Title : ' + data.Title);
        console.log('Year : ' + data.Year);
        console.log('imdbRating : ' + data.imdbRating);
        console.log('Rotten Tomatoes : ' + rottenTommatoes);
        console.log('Country : ' + data.Country);
        console.log('Language : ' + data.Language);
        console.log('Plot : ' + data.Plot);
        console.log('Actors : ' + data.Actors);
        consloe.log('.................................................')
        let movieData = `
        Title : ${data.Title}
        Year : ${data.Year}
        imdbRating : ${data.imdbRating}
        Rotten Tomatoes : ${rottenTommatoes} 
        Country : ${data.Country}
        Language : ${data.Language}
        Plot : ${data.Plot}
        Actors : ${data.Actors}
        ------------------------------------------------
        `
        writteToLogFile(movieData);
      }
    }
  })
}

function doWhatItSay() {
  // read file and take action 
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err)
    } else {
      let dataArr = data.split(",");
      if (dataArr.legth === 2) {
        // First element is the command
        let actionCmd = dataArr[0];
        // search topic
        let searchTopic = dataArr[1].replace(/"/g, '');
        searchTopic = searchTopic.slice(0).join('+');
        // Process commands
        if (actionCmd !== 'do-what-it-says') {
          takeAction(actionCmd, searchTopic);
        } else {
          console.log('do-what-it-says is an invalid entry, as it can cause an infinite loop.')
          writteToLogFile('do-what-it-says is an invalid entry, as it can cause an infinite loop.');
        }
      } else {
        console.log('Invalid file content!');
        writteToLogFile('Invalid file content!');
      }
    }
  })
}

function writteToLogFile(logActivity) {
  // write/append file
  fs.appendFile('file.txt', logActivity, e => e ? console.log(e) : console.log('Success!'))
}