// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');


// Create a route for root - /
app.get("/", function(req, res) {
    res.render("index");
});


// Task 1 JSON formatted listing of Users
app.get("/user", function(req, res) {
    var sql = 'select * from UsersList';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });

});

app.get("/all-users", function(req,res) {
    var sql = 'select * from UsersList';
    db.query(sql).then(results => (
        res.render('UsersList',{data: results})
    ))
});

// each individual page of our users
app.get("/User-single/:id", function(req, res) {
    var userID = req.params.id;

    var userSql = 'SELECT * FROM UsersList WHERE UserID = ?';
    var playlistSql = 'SELECT * FROM Playlist WHERE UserID = ?';
    // Join Song and Artist tables to get all song and artist info
    var favSongSql = 'SELECT Song.*, Artist.ArtistName, Artist.Genre FROM Song JOIN Artist ON Song.ArtistID = Artist.ArtistID WHERE Song.SongID = ?';
    // Get favourite artist - ArtistID matches UserID
    var favArtistSql = 'SELECT * FROM Artist WHERE ArtistID = ?';

    db.query(userSql, [userID]).then(userResults => {
        db.query(playlistSql, [userID]).then(playlistResults => {
            db.query(favSongSql, [userID]).then(favResults => {
                db.query(favArtistSql, [userID]).then(artistResults => {
                    res.render('User-single', {
                        user: userResults[0],       // username, realname
                        data: playlistResults,       // their playlists
                        favSong: favResults[0],      // their favourite song
                        favArtist: artistResults[0]  // their favourite artist
                    });
                });
            });
        });
    });
});


// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    var sql = 'select * from test_table';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});