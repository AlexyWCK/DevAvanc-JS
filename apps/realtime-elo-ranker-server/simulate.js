// Use the global `fetch` available in Node 18+.
const players = ['alice', 'bob', 'carol', 'dave'];

async function addPlayers() {
  for (const p of players) {
    await fetch('http://localhost:8080/api/player', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: p }) });
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
  const r = await fetch('http://localhost:8080/api/match', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const json = await r.json();
  console.log('match', body, '=>', json);
}

(async () => {
  // Ensure Node has global fetch
  if (typeof fetch !== 'function') {
    console.error('Global fetch is not available in this Node runtime. Please run with Node 18+ or install node-fetch and update simulate.js');
    process.exit(1);
  }
  await addPlayers();
  setInterval(simulateIteration, 2000);
})();
