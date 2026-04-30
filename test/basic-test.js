const fs = require('fs');

const requiredFiles = [
  'app/app.js',
  'app/services/db.js',
  'app/models/user.js',
  'app/models/song.js',
  'app/models/comment.js',
  'app/models/playlist.js',
  'app/views/layout.pug',
  'app/views/index.pug',
  'database-file/soundboard.sql'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

console.log('Basic project structure test passed.');
