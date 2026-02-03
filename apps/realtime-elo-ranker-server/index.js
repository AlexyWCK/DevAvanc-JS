const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db, getPlayer, createPlayer, updatePlayerRank, listPlayers, insertMatch, avgRank } = require('./db');
const { updateRating } = require('./elo');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple SSE clients list
const sseClients = new Set();

function broadcast(event) {
  const data = `event: message\ndata: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    try { res.write(data); } catch(e) { /* ignore */ }
  }
}

// POST /api/player -> create player with optional rank
app.post('/api/player', (req, res) => {
  const { id, rank } = req.body;
  if (!id) return res.status(400).send({ code: 400, message: 'id required' });
  const existing = getPlayer(id);
  if (existing) return res.status(409).send({ code: 409, message: 'player already exists' });
  const initialRank = typeof rank === 'number' ? Math.round(rank) : avgRank();
  createPlayer(id, initialRank);
  const player = getPlayer(id);
  broadcast({ type: 'PlayerCreated', player });
  res.status(200).send(player);
});

// POST /api/match { winner, loser, draw }
app.post('/api/match', (req, res) => {
  const { winner, loser, draw } = req.body;
  if (!winner || !loser) return res.status(400).send({ code: 400, message: 'winner and loser required' });
  const w = getPlayer(winner);
  const l = getPlayer(loser);
  if (!w || !l) return res.status(422).send({ code: 422, message: 'player not found' });

  // results
  const resW = draw ? 0.5 : 1;
  const resL = draw ? 0.5 : 0;

  const newW = updateRating(w.rank, l.rank, resW);
  const newL = updateRating(l.rank, w.rank, resL);

  // Persist
  updatePlayerRank(winner, newW);
  updatePlayerRank(loser, newL);
  insertMatch(winner, loser, !!draw);

  const payload = {
    winner: { id: winner, rank: newW },
    loser: { id: loser, rank: newL }
  };

  broadcast({ type: 'RankingUpdate', player: payload.winner });
  broadcast({ type: 'RankingUpdate', player: payload.loser });

  res.status(200).send(payload);
});

// GET /api/ranking
app.get('/api/ranking', (req, res) => {
  const players = listPlayers().map(p => ({ id: p.id, rank: p.rank }));
  players.sort((a,b) => b.rank - a.rank);
  res.status(200).send(players);
});

// GET /api/ranking/events -> SSE
app.get('/api/ranking/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Content-Encoding': 'none',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  res.write('\n');
  sseClients.add(res);
  req.on('close', () => { sseClients.delete(res); res.end(); });
});

// Health
app.get('/health', (req, res) => res.send({ ok: true }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});
