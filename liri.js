require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

// var spotify = new Spotify({
//     id: keys.spotify.id,
//     secret: keys.spotify.secret
//   });



inquirer.prompt([
    {
    type: "list",
    message: "What can I help you with today?",
    choices: ["concert-this", "Spotify-the-song", "movie-this",  "do-what-it-says"],
    name: "command"
    }
])
.then(function(inquirerResponse){
    if (inquirerResponse.command == "concert-this") {
        concertSearch();
    }

    else if (inquirerResponse.command == "Spotify-the-song") {
        songSearch();
    }

    else if (inquirerResponse.command == "movie-this") {
        movieSearch();
    }

    else if (inquirerResponse.command == "do-what-it-says") {


    fs.readFile("random.txt", "utf8", function(err, data) {
    // if err, log err, else log data    
    if (err) throw err;
     
    var content = data.split(",");
    console.log(content[1]);
    spotify.search({ type: 'track', query: content[1] })
    .then(function(response)
    {
        // console.log(response);
        var data = response.tracks.items[0];
        console.log("* Artist : " + data.album.artists[0].name);
        console.log("* The song's name : " + data.name);
        console.log("* A preview link of the song from Spotify : " + data.preview_url);
        console.log("* The album that the song is from : " + data.album.name);
    });
    })
    };
});

function concertSearch(){
    inquirer.prompt([
        {
          type: "input",
          name: "ConcertName",
          message: "Who you want to search?"
        }
  
      ])
      .then(function(input) 
      {
        var queryUrl = "https://rest.bandsintown.com/artists/" + input.ConcertName + "/events?app_id=codingbootcamp";
        axios.get(queryUrl)
            .then(function(response)
            {
                // console.log(response);
                var data = response.data[0].venue;
                console.log("* Name of the venue : " + data.name);
                console.log("* Venue location : " + data.country + " " +  data.region + " " +  data.city );
                console.log("* Date of the Event : " + moment(response.data[1].datetime).format("MM/DD/YYYY"));
            });
        })
}
var songName = "The Sign";
function songSearch(){
    inquirer.prompt([
        {
          type: "input",
          name: "songName",
          message: "What song you want to search?"
        }
  
      ])
      .then(function(input) 
      { 
        console.log(songName);
        if(input.songName){
            songName = input.songName;
        }
        console.log(songName);
        spotify.search({ type: 'track', query: songName })
            .then(function(response)
            {
                // console.log(response);
                var data = response.tracks.items[0];
                console.log("* Artist : " + data.album.artists[0].name);
                console.log("* The song's name : " + data.name);
                console.log("* A preview link of the song from Spotify : " + data.preview_url);
                console.log("* The album that the song is from : " + data.album.name);
            });
        })
}

var movieName = "Mr. Nobody";
function movieSearch(){
    inquirer.prompt([
        {
          type: "input",
          name: "movieName",
          message: "What movie you want to search?"
        }
  
      ])
      .then(function(input) 
      { 

        if(input.movieName){
            movieName = input.movieName;
        }
        axios.get(`http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`)
            .then(function(response)
            {
                console.log(movieName);
                // console.log(response);
                var data = response.data;
                console.log("* The tiltle of the Movie : " + data.Title);
                console.log("* The Released Year : " + data.Year);
                console.log("* The Discription : " + data.Plot);
                console.log("* IMDB Rating of the Movie : " + data.imdbRating);  
                console.log("* Rotten Tomatoes Rating of the moive : " + data.Ratings[1].Value);
                console.log("* Country where the movie was produced : " + data.Country);
                console.log("* Language of the movie : " + data.Language);
                console.log("* Actors in the movie : " + data.Actors);
            });
        })
}