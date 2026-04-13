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


// Single user page - shows their playlist and favourite song
app.get("/User-single/:id", function(req, res) {   
    var userID = req.params.id;
    
    // SQL query to get all playlists belonging to this user
    var playlistSql = 'SELECT * FROM Playlist WHERE UserID = ?';
    
    // SQL query to get the favourite song - SongID matches the UserID
    // for example user 1's (taro) favourite song is SongID 1 (rockstar)
    var favSongSql = 'SELECT * FROM Song WHERE SongID = ?';
    
    // Runs the playlist query first by passing in the userID to replace the "?"
    db.query(playlistSql, [userID]).then(playlistResults => {
        
        // Once playlist query is done, run the favourite song query
        // Also passing in userID to replace the ?
        db.query(favSongSql, [userID]).then(favResults => {
            
            //prints results to terminal
            console.log('UserID:', userID);
            console.log('favResults:', favResults);
            
            // Sends results to the User-single.pug template
            // data = all their playlists (array of results)
            // favSong = their favourite song (just the first result [0])
            res.render('User-single', {
                data: playlistResults,   // used as 'data' in pug
                favSong: favResults[0]   // used as 'favSong' in pug
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