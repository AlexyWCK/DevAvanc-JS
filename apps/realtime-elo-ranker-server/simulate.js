// Configurable simulator for the API.
// Usage: set env vars `API_URL` (default http://localhost:8080),
// `PLAYERS` (comma-separated list) or `PLAYERS_COUNT` (number of generated bots),
// and `INTERVAL_MS` (ms between matches). Run with Node 18+ (global fetch).

const API_URL = process.env.API_URL || 'http://localhost:8080';
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 2000);
const PLAYERS_ENV = process.env.PLAYERS;
const PLAYERS_COUNT = Number(process.env.PLAYERS_COUNT || 4);

function makePlayers() {
  if (PLAYERS_ENV && PLAYERS_ENV.trim().length > 0) {
    return PLAYERS_ENV.split(',').map(s => s.trim()).filter(Boolean);
  }
  const out = [];
  for (let i = 0; i < Math.max(1, PLAYERS_COUNT); i++) out.push(`bot-${i + 1}`);
  return out;
}

const players = makePlayers();

async function addPlayers() {
  for (const p of players) {
    try {
      await fetch(`${API_URL}/api/player`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: p }) });
      console.log('created player', p);
    } catch (e) {
      console.error('failed to create player', p, e?.message || e);
    }
  }
}

async function simulateIteration() {
  const a = players[Math.floor(Math.random() * players.length)];
  let b = players[Math.floor(Math.random() * players.length)];
  while (b === a) b = players[Math.floor(Math.random() * players.length)];
  const draw = Math.random() < 0.1;
  const winner = draw ? a : (Math.random() < 0.5 ? a : b);
  const loser = winner === a ? b : a;
  const body = { winner, loser, draw };
  try {
    const r = await fetch(`${API_URL}/api/match`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      console.error('match error', r.status, txt);
      return;
    }
    const json = await r.json().catch(() => null);
    console.log('match', body, '=>', json);
  } catch (e) {
    console.error('failed to post match', e?.message || e);
  }
}

(async () => {
  if (typeof fetch !== 'function') {
    console.error('Global fetch is not available in this Node runtime. Please run with Node 18+ or install node-fetch and update simulate.js');
    process.exit(1);
  }
  console.log('Simulator starting', { API_URL, players, INTERVAL_MS });
  await addPlayers();
  setInterval(simulateIteration, INTERVAL_MS);
})();
