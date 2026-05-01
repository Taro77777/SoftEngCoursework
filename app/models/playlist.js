const db = require("../services/db");

class Playlist {
  static async getAllPublic() {
  return await db.query(
    `SELECT Playlists.*, Users.username,
            AVG(PlaylistRatings.rating) AS average_rating,
            COUNT(PlaylistRatings.id) AS rating_count
     FROM Playlists
     LEFT JOIN Users ON Playlists.created_by = Users.id
     LEFT JOIN PlaylistRatings ON PlaylistRatings.playlist_id = Playlists.id
     WHERE Playlists.is_public = true
     GROUP BY Playlists.id
     ORDER BY Playlists.id DESC`
  );
  }

  static async getByUser(userId) {
    return await db.query(
      `SELECT Playlists.*,
        (SELECT COUNT(*) FROM PlaylistSongs WHERE PlaylistSongs.playlist_id = Playlists.id) AS song_count
       FROM Playlists
       WHERE Playlists.created_by = ?
       ORDER BY Playlists.id DESC`,
      [userId]
    );
  }

  static async getById(id) {
    const rows = await db.query(
      `SELECT Playlists.*, Users.username
       FROM Playlists
       LEFT JOIN Users ON Playlists.created_by = Users.id
       WHERE Playlists.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getSongs(playlistId) {
    return await db.query(
      `SELECT Songs.*, Genres.name AS genre_name, Artists.name AS artist, Users.username AS added_by_username
       FROM PlaylistSongs
       JOIN Songs ON PlaylistSongs.song_id = Songs.id
       LEFT JOIN Genres ON Songs.genre_id = Genres.id
       LEFT JOIN Artists ON Songs.artist_id = Artists.id
       LEFT JOIN Users ON PlaylistSongs.added_by = Users.id
       WHERE PlaylistSongs.playlist_id = ?
       ORDER BY PlaylistSongs.added_at DESC`,
      [playlistId]
    );
  }

static async create(data) {
  const result = await db.query(
    `INSERT INTO Playlists (title, description, cover_image, created_by, is_public)
     VALUES (?, ?, ?, ?, true)`,
    [
      data.title,
      data.description,
      data.cover_image || "/images/playlists/default-playlist.svg",
      data.created_by
    ]
  );

  return result.insertId;
}

  static async addSong(playlistId, songId, userId) {
    const existing = await db.query(
      "SELECT id FROM PlaylistSongs WHERE playlist_id = ? AND song_id = ?",
      [playlistId, songId]
    );
    if (existing.length) return existing[0].id;

    const result = await db.query(
      "INSERT INTO PlaylistSongs (playlist_id, song_id, added_by) VALUES (?, ?, ?)",
      [playlistId, songId, userId]
    );
    return result.insertId;
  }

  static async ratePlaylist(playlistId, userId, rating) {
  return await db.query(
    `INSERT INTO PlaylistRatings (playlist_id, user_id, rating)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), created_at = CURRENT_TIMESTAMP`,
    [playlistId, userId, rating]
  );
  }

  static async getAverageRating(playlistId) {
  const results = await db.query(
    `SELECT AVG(rating) AS average_rating, COUNT(*) AS rating_count
     FROM PlaylistRatings
     WHERE playlist_id = ?`,
    [playlistId]
  );

  return results[0];
  }

  static async getUserRating(playlistId, userId) {
  const results = await db.query(
    `SELECT rating
     FROM PlaylistRatings
     WHERE playlist_id = ? AND user_id = ?`,
    [playlistId, userId]
  );

  return results[0];
  }

  
}

module.exports = { Playlist };
