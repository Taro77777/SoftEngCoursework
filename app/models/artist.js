// part of the model: responsible for getting/updating db data

const db = require("../services/db");

class Artist {
  static async getById(id) {
    const rows = await db.query("SELECT * FROM Artists WHERE id = ?", [id]);
    return rows[0];
  }

  //query for getting id

  static async getSongs(id) {
    return await db.query(
      `SELECT Songs.*, Genres.name AS genre_name, Artists.name AS artist
       FROM Songs
       LEFT JOIN Genres ON Songs.genre_id = Genres.id
       LEFT JOIN Artists ON Songs.artist_id = Artists.id
       WHERE Songs.artist_id = ?
       ORDER BY Songs.title`,
      [id]
    );
  }       //query for getting a song using the id
}

module.exports = { Artist };    //exports this as an artists table
