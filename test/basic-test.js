const fs = require('fs');

//lets java check if files exist

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

//list of files project must have

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}    //loops through every file and checks if it exists

console.log('Basic project structure test passed.');
