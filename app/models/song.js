const db = require("../services/db");

class Song {
  static async getAll() {
    return await db.query(
      `SELECT Songs.*, Genres.name AS genre_name, Artists.name AS artist, Artists.image AS artist_image
       FROM Songs
       LEFT JOIN Genres ON Songs.genre_id = Genres.id
       LEFT JOIN Artists ON Songs.artist_id = Artists.id
       ORDER BY Songs.title`
    );
  }

  static async getById(id) {
    const rows = await db.query(
      `SELECT Songs.*, Genres.name AS genre_name, Artists.name AS artist, Artists.image AS artist_image, Artists.bio AS artist_bio
       FROM Songs
       LEFT JOIN Genres ON Songs.genre_id = Genres.id
       LEFT JOIN Artists ON Songs.artist_id = Artists.id
       WHERE Songs.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async search(term) {
    const likeTerm = `%${term || ""}%`;
    return await db.query(
      `SELECT Songs.*, Genres.name AS genre_name, Artists.name AS artist, Artists.image AS artist_image
       FROM Songs
       LEFT JOIN Genres ON Songs.genre_id = Genres.id
       LEFT JOIN Artists ON Songs.artist_id = Artists.id
       WHERE Songs.title LIKE ? OR Artists.name LIKE ? OR Genres.name LIKE ?
       ORDER BY Artists.name, Songs.title`,
      [likeTerm, likeTerm, likeTerm]
    );
  }
}

module.exports = { Song };
