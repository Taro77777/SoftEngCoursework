const db = require("../services/db");

class Comment {
  static async getForSong(songId) {
    const rows = await db.query(
      `SELECT Comments.*, Users.username, Users.profile_image,
              parent.username AS parent_username
       FROM Comments
       JOIN Users ON Comments.user_id = Users.id
       LEFT JOIN Comments parent_comment ON Comments.parent_id = parent_comment.id
       LEFT JOIN Users parent ON parent_comment.user_id = parent.id
       WHERE Comments.song_id = ?
       ORDER BY Comments.created_at ASC`,
      [songId]
    );

    const byId = new Map();
    const topLevel = [];

    for (const row of rows) {
      row.replies = [];
      byId.set(row.id, row);
    }

    for (const row of rows) {
      if (row.parent_id && byId.has(row.parent_id)) {
        byId.get(row.parent_id).replies.push(row);
      } else {
        topLevel.push(row);
      }
    }

    return topLevel.reverse();
  }

  static async add(songId, userId, text, parentId = null) {
    return await db.query(
      "INSERT INTO Comments (song_id, user_id, parent_id, comment_text) VALUES (?, ?, ?, ?)",
      [songId, userId, parentId, text]
    );
  }

  static async getById(commentId) {
    const rows = await db.query(
      `SELECT Comments.*, Users.username
       FROM Comments
       JOIN Users ON Comments.user_id = Users.id
       WHERE Comments.id = ?`,
      [commentId]
    );
    return rows[0];
  }

static async update(commentId, userId, text, isAdmin = false) {
  if (isAdmin) {
    return await db.query(
      "UPDATE Comments SET comment_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [text, commentId]
    );
  }

  return await db.query(
    "UPDATE Comments SET comment_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
    [text, commentId, userId]
  );
}

  static async delete(commentId, userId, isAdmin = false) {
    if (isAdmin) {
      await db.query("DELETE FROM CommentReports WHERE comment_id = ?", [commentId]);
      await db.query("DELETE FROM Comments WHERE parent_id = ?", [commentId]);
      return await db.query("DELETE FROM Comments WHERE id = ?", [commentId]);
    }

    await db.query("DELETE FROM CommentReports WHERE comment_id = ?", [commentId]);
    await db.query("DELETE FROM Comments WHERE parent_id = ? AND user_id = ?", [commentId, userId]);
    return await db.query("DELETE FROM Comments WHERE id = ? AND user_id = ?", [commentId, userId]);
  }

  static async report(commentId, reporterId, reason) {
    return await db.query(
      "INSERT INTO CommentReports (comment_id, reporter_id, reason) VALUES (?, ?, ?)",
      [commentId, reporterId, reason || "No reason given"]
    );
  }

  static async getReports() {
    return await db.query(
      `SELECT CommentReports.*, Comments.comment_text, Comments.song_id,
              Songs.title AS song_title,
              author.username AS comment_author,
              reporter.username AS reporter_username
       FROM CommentReports
       JOIN Comments ON CommentReports.comment_id = Comments.id
       JOIN Songs ON Comments.song_id = Songs.id
       JOIN Users author ON Comments.user_id = author.id
       JOIN Users reporter ON CommentReports.reporter_id = reporter.id
       ORDER BY CommentReports.created_at DESC`
    );
  }

  static async resolveReport(reportId) {
    return await db.query("UPDATE CommentReports SET status = 'resolved' WHERE id = ?", [reportId]);
  }

  static async getLatestDiscussion() {
  const results = await db.query(
    `SELECT 
        Comments.id,
        Comments.song_id,
        Comments.comment_text,
        Comments.created_at,
        Users.username,
        Songs.title,
        Songs.cover_image
     FROM Comments
     JOIN Users ON Comments.user_id = Users.id
     JOIN Songs ON Comments.song_id = Songs.id
     WHERE Comments.parent_id IS NULL
     ORDER BY Comments.created_at DESC
     LIMIT 1`
  );

  return results[0];
  }
}

module.exports = { Comment };
