DROP TABLE IF EXISTS CommentReports;
DROP TABLE IF EXISTS PlaylistSongs;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Playlists;
DROP TABLE IF EXISTS Songs;
DROP TABLE IF EXISTS Artists;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  real_name VARCHAR(100),
  age INT,
  bio TEXT,
  favourite_genre VARCHAR(100),
  profile_image VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',
  PRIMARY KEY (id)
);

CREATE TABLE Genres (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Artists (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  bio TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE Songs (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  genre_id INT,
  release_year INT,
  cover_image VARCHAR(255),
  description TEXT,
  audio_file VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (artist_id) REFERENCES Artists(id),
  FOREIGN KEY (genre_id) REFERENCES Genres(id)
);

CREATE TABLE Comments (
  id INT NOT NULL AUTO_INCREMENT,
  song_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_id INT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (song_id) REFERENCES Songs(id),
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (parent_id) REFERENCES Comments(id) ON DELETE CASCADE
);

CREATE TABLE CommentReports (
  id INT NOT NULL AUTO_INCREMENT,
  comment_id INT NOT NULL,
  reporter_id INT NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_id) REFERENCES Users(id)
);

CREATE TABLE Playlists (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255),
  created_by INT,
  is_public BOOLEAN DEFAULT true,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES Users(id)
);

  CREATE TABLE PlaylistRatings (
  id INT NOT NULL AUTO_INCREMENT,
  playlist_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_playlist_user_rating (playlist_id, user_id),
  FOREIGN KEY (playlist_id) REFERENCES Playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE PlaylistSongs (
  id INT NOT NULL AUTO_INCREMENT,
  playlist_id INT NOT NULL,
  song_id INT NOT NULL,
  added_by INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_playlist_song (playlist_id, song_id),
  FOREIGN KEY (playlist_id) REFERENCES Playlists(id),
  FOREIGN KEY (song_id) REFERENCES Songs(id),
  FOREIGN KEY (added_by) REFERENCES Users(id)
);

INSERT INTO Genres (name) VALUES
('R&B'), ('Hip-Hop'), ('Indie'), ('Rock'), ('Electronic'), ('Pop'), ('Somali Funk'), ('Alternative');

INSERT INTO Users (email, password, username, real_name, age, bio, favourite_genre, profile_image, role) VALUES
('admin@musicwe.com', 'admin123', 'admin', 'MusicWe Admin', 30, 'Admin account for reviewing reported comments.', 'Everything', '/images/default-profile.svg', 'admin'),
('seb@example.com', 'password123', 'sebzzz', 'Seb Moreno', 20, 'I fw underrated artists and chilling with music in the background.', 'R&B', '/images/default-profile.svg', 'user'),
('habsa@example.com', 'password123', 'h4sh', 'Habsa Sharif', 22, 'When I say i listen to everything, i mean EVERYTHING.', 'Indie', '/images/default-profile.svg', 'user'),
('taro@example.com', 'password123', 'tarotunez', 'Taro Chamberlain', 21, 'Playlist addict, got a mix for every occasion', 'Alternative', '/images/default-profile.svg', 'user');

INSERT INTO `Artists` (`id`, `name`, `image`, `bio`) VALUES
(1, 'Chappell Roan', '/images/artists/artist-1.jpg', 'A hot, new pop artist who has skyrocketed to fame since emerging on the scene. '),
(2, 'Dreamgirl', '/images/artists/artist-2.jpg', 'An alternative, indie group with an utterly dreamy sound. '),
(3, 'Peach Pit', '/images/artists/artist-3.jpg', 'A classic, Canadian indie-rock group with a very distinct sound.'),
(4, 'Azealia Banks', '/images/artists/artist-4.jpg', 'A true lyricist with banger after banger.'),
(5, 'Jantra', '/images/artists/artist-5.jpg', 'A pioneer of Astro-Nubian electronic Jagalara in the underground Sudanese music scene'),
(6, 'Her''s', '/images/artists/artist-6.jpg', 'A dreamy-melancholy-indie sounding duo from the UK.'),
(7, 'Dur Dur Band', '/images/artists/artist-7.jpg', 'Icons of the 70''s/80''s Somali music scene'),
(8, 'Shy Girl', '/images/artists/artist-8.jpg', 'A UK artist making waves in the experimental club pop scene. ');

INSERT INTO Songs (title, artist_id, genre_id, release_year, cover_image, description, audio_file) VALUES
('Love Me Anyway', 1, 1, 2024, '/images/covers/cover-1.jpg', 'A before-fame track with soft vocals and an endearing tone.', NULL),
('Picture You', 1, 1, 2023, '/images/covers/cover-2.jpg', 'A beautifully sung track with stunning vocal flips.', NULL),
('Mythos', 2, 3, 2023, '/images/covers/cover-3.jpg', 'An indie track with a very catchy, funky tune.', NULL),
('Bollywood', 2, 3, 2021, '/images/covers/cover-4.jpg', 'A sadder indie song with a nostalgic chorus.', NULL),
('Figure 8', 3, 4, 2022, '/images/covers/cover-5.jpg', 'A dichotomously cheery and melancholic indie track from none other than Peach Pit.', NULL),
('Camilla, I''m at Home', 3, 4, 2024, '/images/covers/cover-6.jpg', 'Fast guitars and a hook that sounds like a live set closer.', NULL),
('Treasure Island', 4, 2, 2024, '/images/covers/cover-7.jpg', 'A sharp track built around a minimal bassline and ultimate summer feels.', NULL),
('Heavy Metal and Reflective', 4, 2, 2022, '/images/covers/cover-8.jpg', 'A confident rap track with a cold, spacious beat.', NULL),
('Ozali', 5, 5, 2023, '/images/covers/cover-9.jpg', 'An electronic track with bright synths and a rainy-night feeling.', NULL),
('Khadija', 5, 5, 2024, '/images/covers/cover-10.jpg', 'Glittering synths and a steady club pulse.', NULL),
('Under Wraps', 6, 6, 2022, '/images/covers/cover-11.jpg', 'A clean bedroom pop song with soft verses.', NULL),
('What Once Was', 6, 1, 2023, '/images/covers/cover-12.jpg', 'A track that tugs at the heartstrings - lamenting loss.', NULL),
('Ladaney', 7, 7, 2024, '/images/covers/cover-13.jpg', 'Warm Somali percussion with a bright summer hook.', '/audio/ladaney.mp3'),
('Wan Ka Helaa', 7, 7, 2022, '/images/covers/cover-14.jpg', 'A breezy rhythm track for sunny playlists.', NULL),
('True Religion', 8, 8, 2023, '/images/covers/cover-15.jpg', 'An alternative hyperpop-esque collaboration track.', NULL),
('BDE (feat. slowthai)', 8, 8, 2024, '/images/covers/cover-16.jpg', 'A very meaninful ballad.', NULL);

INSERT INTO Comments (song_id, user_id, parent_id, comment_text) VALUES
(1, 2, NULL, 'This is exactly the kind of song I would put on at 2am.'),
(1, 3, NULL, 'The production is clean but I wish the chorus hit harder.'),
(1, 2, 2, 'Fair, but I think the restraint is what makes it good.'),
(3, 4, NULL, 'This would be perfect for a study playlist.'),
(5, 3, NULL, 'The guitar tone on this one is actually beautiful.'),
(7, 2, NULL, 'The flow is strong, but the beat carries the whole thing.'),
(13, 4, NULL, 'This one immediately needs to go on a summer playlist.');

INSERT INTO Playlists (title, description, cover_image, created_by, is_public) VALUES
('Late Night Study', 'Soft tracks for coding, essays, and last-minute coursework panic.', '/images/playlists/ocean.jpg', 4, true),
('Gym Rotation', 'Songs with enough energy for training sessions.', '/images/playlists/lightning.jpg', 3, true),
('Rainy Bus Ride', 'Melancholy tracks for staring out the window.', '/images/playlists/blue-night.jpg', 2, true);

INSERT INTO PlaylistSongs (playlist_id, song_id, added_by) VALUES
(1, 1, 4), (1, 2, 4), (1, 3, 4), (1, 9, 4), (1, 15, 4),
(2, 5, 3), (2, 6, 3), (2, 7, 3), (2, 10, 3),
(3, 1, 2), (3, 9, 2), (3, 12, 2), (3, 16, 2);

INSERT INTO PlaylistRatings (playlist_id, user_id, rating) VALUES
(1, 2, 5),
(1, 3, 4),
(2, 4, 5),
(3, 2, 3);