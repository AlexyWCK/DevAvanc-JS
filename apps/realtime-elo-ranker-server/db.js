const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'data.db'));

// Initialize tables
db.prepare(`CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  rank INTEGER NOT NULL
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  winner TEXT,
  loser TEXT,
  draw INTEGER,
  timestamp INTEGER
)`).run();

module.exports = {
  db,
  getPlayer: (id) => db.prepare('SELECT * FROM players WHERE id = ?').get(id),
  createPlayer: (id, rank) => db.prepare('INSERT INTO players (id, rank) VALUES (?, ?)').run(id, rank),
  updatePlayerRank: (id, rank) => db.prepare('UPDATE players SET rank = ? WHERE id = ?').run(rank, id),
  listPlayers: () => db.prepare('SELECT * FROM players').all(),
  insertMatch: (winner, loser, draw) => db.prepare('INSERT INTO matches (winner, loser, draw, timestamp) VALUES (?, ?, ?, ?)').run(winner, loser, draw ? 1 : 0, Date.now()),
  listMatches: () => db.prepare('SELECT * FROM matches ORDER BY id DESC').all(),
  avgRank: () => {
    const row = db.prepare('SELECT AVG(rank) as avg FROM players').get();
    return row && row.avg ? Math.round(row.avg) : 1000;
  }
};
