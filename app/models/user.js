const db = require("../services/db");
const bcrypt = require("bcryptjs");

class User {
  constructor(email) {
    this.email = email;
  }

  static async getAll() {
    return await db.query("SELECT id, username, real_name, age, bio, favourite_genre, profile_image, role FROM Users ORDER BY username");
  }

  static async getById(id) {
    const rows = await db.query("SELECT id, username, real_name, age, bio, favourite_genre, profile_image, role FROM Users WHERE id = ?", [id]);
    return rows[0];
  }

  static async updateProfile(id, data) {
    return await db.query(
      "UPDATE Users SET username = ?, real_name = ?, age = ?, bio = ?, favourite_genre = ? WHERE id = ?",
      [data.username, data.real_name, data.age || null, data.bio || "", data.favourite_genre || "", id]
    );
  }

  async getIdFromEmail() {
    const rows = await db.query("SELECT id, username, role FROM Users WHERE email = ?", [this.email]);
    if (rows.length === 0) return false;
    this.id = rows[0].id;
    this.username = rows[0].username;
    this.role = rows[0].role;
    return this.id;
  }

  async addUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await db.query(
      `INSERT INTO Users (email, password, username, real_name, age, bio, favourite_genre, profile_image, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user')`,
      [
        this.email,
        hashedPassword,
        data.username,
        data.real_name || "",
        data.age || null,
        data.bio || "",
        data.favourite_genre || "",
        "/images/default-profile.svg"
      ]
    );
    this.id = result.insertId;
    this.username = data.username;
    this.role = "user";
    return true;
  }

  async authenticate(password) {
    const rows = await db.query("SELECT id, username, password, role FROM Users WHERE email = ?", [this.email]);
    if (rows.length === 0 || !rows[0].password) return false;

    const storedPassword = rows[0].password;
    let match = false;

    if (storedPassword.startsWith("$2")) {
      match = await bcrypt.compare(password, storedPassword);
    } else {
      
      match = password === storedPassword;
      if (match) {
        const hash = await bcrypt.hash(password, 10);
        await db.query("UPDATE Users SET password = ? WHERE id = ?", [hash, rows[0].id]);
      }
    }

    if (match) {
      this.id = rows[0].id;
      this.username = rows[0].username;
      this.role = rows[0].role;
      return true;
    }
    return false;
  }

  static async getCreatorAverageRating(userId) {
  const results = await db.query(
    `SELECT AVG(PlaylistRatings.rating) AS average_rating,
            COUNT(PlaylistRatings.id) AS rating_count
     FROM Playlists
     JOIN PlaylistRatings ON PlaylistRatings.playlist_id = Playlists.id
     WHERE Playlists.created_by = ?`,
    [userId]
  );

  return results[0];
  }

}

module.exports = { User };
