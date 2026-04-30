const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./app/views");

app.use(session({
  secret: "MusicWe-coursework-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const db = require("./services/db");
const { User } = require("./models/user");
const { Song } = require("./models/song");
const { Artist } = require("./models/artist");
const { Comment } = require("./models/comment");
const { Playlist } = require("./models/playlist");

function requireLogin(req, res, next) {
  if (!req.session.loggedIn) return res.redirect("/login");
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.loggedIn || req.session.role !== "admin") {
    return res.status(403).render("message", {
      title: "Admin only",
      message: "You need an admin account to view this page."
    });
  }
  next();
}

app.use(function(req, res, next) {
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.currentUserId = req.session.uid;
  res.locals.username = req.session.username;
  res.locals.isAdmin = req.session.role === "admin";
  next();
});

app.get("/", async function(req, res) {
  const songs = await Song.getAll();
  const playlists = await Playlist.getAllPublic();
  const latestDiscussion = await Comment.getLatestDiscussion();
  res.render("index", {
    title: "MusicWe",
    songs: songs.slice(0, 6),
    playlists: playlists.slice(0, 3),
    latestDiscussion
  });
});

app.get("/search", async function(req, res) {
  const q = (req.query.q || "").trim();
  const songs = q ? await Song.search(q) : [];
  res.render("search-results", { title: "Search", q, songs });
});

app.get("/users", async function(req, res) {
  const users = await User.getAll();
  res.render("users", { title: "Community Members", users });
});

app.get("/users/:id", async function(req, res) {
  const user = await User.getById(req.params.id);

  if (!user) {
    return res.status(404).render("message", {
      title: "Not found",
      message: "User not found."
    });
  }

  const playlists = await Playlist.getByUser(req.params.id);
  const ratingSummary = await User.getCreatorAverageRating(req.params.id);

  res.render("user-profile", {
    title: user.username,
    user,
    playlists,
    ratingSummary
  });
});

app.get("/profile/edit", requireLogin, async function(req, res) {
  const user = await User.getById(req.session.uid);
  res.render("edit-profile", { title: "Edit Profile", user });
});

app.post("/profile/edit", requireLogin, async function(req, res) {
  await User.updateProfile(req.session.uid, req.body);
  res.redirect("/users/" + req.session.uid);
});

app.get("/songs", async function(req, res) {
  const q = (req.query.q || "").trim();
  const songs = q ? await Song.search(q) : await Song.getAll();
  res.render("songs", { title: "Songs", songs, q });
});

app.get("/songs/:id", async function(req, res) {
  const song = await Song.getById(req.params.id);
  if (!song) return res.status(404).render("message", { title: "Not found", message: "Song not found." });
  const comments = await Comment.getForSong(req.params.id);
  const playlists = req.session.loggedIn ? await Playlist.getAllPublic() : [];
  res.render("song-detail", { title: song.title, song, comments, playlists });
});

app.post("/songs/:id/comments", requireLogin, async function(req, res) {
  const text = (req.body.comment_text || "").trim();
  if (text.length > 0) {
    await Comment.add(req.params.id, req.session.uid, text);
  }
  res.redirect("/songs/" + req.params.id);
});

app.post("/comments/:id/replies", requireLogin, async function(req, res) {
  const text = (req.body.comment_text || "").trim();
  const songId = req.body.song_id;
  if (text.length > 0) {
    await Comment.add(songId, req.session.uid, text, req.params.id);
  }
  res.redirect("/songs/" + songId);
});

app.get("/comments/:id/edit", requireLogin, async function(req, res) {
  const comment = await Comment.getById(req.params.id);

  if (!comment) {
    return res.status(404).render("message", {
      title: "Not found",
      message: "Comment not found."
    });
  }

  const ownsComment = Number(comment.user_id) === Number(req.session.uid);
  const isAdminUser = req.session.role === "admin";

  if (!ownsComment && !isAdminUser) {
    return res.status(403).render("message", {
      title: "Not allowed",
      message: "You can only edit your own comments."
    });
  }

  res.render("edit-comment", {
    title: "Edit Comment",
    comment
  });
});

app.post("/comments/:id/edit", requireLogin, async function(req, res) {
  const comment = await Comment.getById(req.params.id);

  if (!comment) {
    return res.status(404).render("message", {
      title: "Not found",
      message: "Comment not found."
    });
  }

  const ownsComment = Number(comment.user_id) === Number(req.session.uid);
  const isAdminUser = req.session.role === "admin";

  if (!ownsComment && !isAdminUser) {
    return res.status(403).render("message", {
      title: "Not allowed",
      message: "You can only edit your own comments."
    });
  }

  await Comment.update(
    req.params.id,
    req.session.uid,
    req.body.comment_text,
    isAdminUser
  );

  res.redirect("/songs/" + comment.song_id);
});

app.post("/comments/:id/delete", requireLogin, async function(req, res) {
  const comment = await Comment.getById(req.params.id);

  if (!comment) {
    return res.status(404).render("message", {
      title: "Not found",
      message: "Comment not found."
    });
  }

  const ownsComment = Number(comment.user_id) === Number(req.session.uid);
  const isAdminUser = req.session.role === "admin";

  if (!ownsComment && !isAdminUser) {
    return res.status(403).render("message", {
      title: "Not allowed",
      message: "You can only delete your own comments."
    });
  }

  await Comment.delete(req.params.id, req.session.uid, isAdminUser);

  res.redirect("/songs/" + comment.song_id);
});

app.post("/comments/:id/report", requireLogin, async function(req, res) {
  const comment = await Comment.getById(req.params.id);

  if (!comment) {
    return res.status(404).render("message", {
      title: "Not found",
      message: "Comment not found."
    });
  }

  await Comment.report(req.params.id, req.session.uid, req.body.reason);

  res.redirect("/songs/" + comment.song_id);
});

app.get("/admin/reports", requireAdmin, async function(req, res) {
  const reports = await Comment.getReports();
  res.render("admin-reports", { title: "Reported Comments", reports });
});

app.post("/admin/reports/:id/resolve", requireAdmin, async function(req, res) {
  await Comment.resolveReport(req.params.id);
  res.redirect("/admin/reports");
});

app.get("/artists/:id", async function(req, res) {
  const artist = await Artist.getById(req.params.id);
  if (!artist) return res.status(404).render("message", { title: "Not found", message: "Artist not found." });
  const songs = await Artist.getSongs(req.params.id);
  res.render("artist-detail", { title: artist.name, artist, songs });
});

app.get("/playlists", async function(req, res) {
  const playlists = await Playlist.getAllPublic();
  res.render("playlists", { title: "Public Playlists", playlists });
});

app.get("/playlists/new", requireLogin, function(req, res) {
  res.render("new-playlist", { title: "Create Playlist" });
});

app.post("/playlists/new", requireLogin, async function(req, res) {
  try {
    await Playlist.create({
      title: req.body.title,
      description: req.body.description,
      cover_image: req.body.cover_image,
      created_by: req.session.uid
    });

    res.redirect("/playlists");
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).render("message", {
      title: "Playlist error",
      message: "There was a problem creating the playlist."
    });
  }
});

app.get("/playlists/:id", async function(req, res) {
  const playlist = await Playlist.getById(req.params.id);

  if (!playlist) {
    return res.status(404).render("message", {
      title: "Not found",
      message: "Playlist not found."
    });
  }

  const songs = await Playlist.getSongs(req.params.id);
  const q = (req.query.q || "").trim();
  const allSongs = q ? await Song.search(q) : await Song.getAll();

  const ratingSummary = await Playlist.getAverageRating(req.params.id);

  let userRating = null;
  if (req.session.loggedIn) {
    userRating = await Playlist.getUserRating(req.params.id, req.session.uid);
  }

  res.render("playlist-detail", {
    title: playlist.title,
    playlist,
    songs,
    allSongs,
    q,
    ratingSummary,
    userRating
  });
});

app.post("/playlists/:id/rate", requireLogin, async function(req, res) {
  const rating = Number(req.body.rating);

  if (rating < 1 || rating > 5) {
    return res.status(400).render("message", {
      title: "Invalid rating",
      message: "Rating must be between 1 and 5."
    });
  }

  await Playlist.ratePlaylist(req.params.id, req.session.uid, rating);

  res.redirect("/playlists/" + req.params.id);
});



app.post("/playlists/:id/add-song", requireLogin, async function(req, res) {
  await Playlist.addSong(req.params.id, req.body.song_id, req.session.uid);
  res.redirect("/playlists/" + req.params.id);
});

app.get("/register", function(req, res) {
  res.render("register", { title: "Register" });
});

app.post("/register", async function(req, res) {
  const user = new User(req.body.email);
  try {
    const existing = await user.getIdFromEmail();
    if (existing) {
      return res.render("message", { title: "Account exists", message: "An account already exists for that email. Try logging in." });
    }
    await user.addUser(req.body);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).render("message", { title: "Registration error", message: "Could not create your account." });
  }
});

app.get("/login", function(req, res) {
  res.render("login", { title: "Login" });
});

app.post("/login", async function(req, res) {
  const user = new User(req.body.email);
  try {
    const found = await user.getIdFromEmail();
    if (!found) return res.render("message", { title: "Login failed", message: "Invalid email address." });
    const match = await user.authenticate(req.body.password);
    if (!match) return res.render("message", { title: "Login failed", message: "Invalid password." });
    req.session.uid = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.loggedIn = true;
    res.redirect("/users/" + user.id);
  } catch (err) {
    console.error(err);
    res.status(500).render("message", { title: "Login error", message: "Could not log you in." });
  }
});

app.get("/logout", function(req, res) {
  req.session.destroy(function() {
    res.redirect("/");
  });
});

app.get("/db_test", async function(req, res) {
  const songs = await db.query("SELECT * FROM Songs");
  res.json(songs);
});

app.listen(3000, function() {
  console.log("Server running at http://127.0.0.1:3000/");
});
