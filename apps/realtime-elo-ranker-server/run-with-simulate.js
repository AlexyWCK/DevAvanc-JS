const { spawn } = require('child_process');

const SERVER_CMD = process.env.SERVER_CMD || 'node';
const SERVER_ARGS = process.env.SERVER_ARGS ? process.env.SERVER_ARGS.split(' ') : ['index.js'];
const SIM_CMD = process.env.SIM_CMD || 'node';
const SIM_ARGS = process.env.SIM_ARGS ? process.env.SIM_ARGS.split(' ') : ['simulate.js'];
const HEALTH_URL = process.env.HEALTH_URL || 'http://localhost:8080/health';
const RETRIES = Number(process.env.START_RETRIES || 20);
const RETRY_DELAY_MS = Number(process.env.RETRY_DELAY_MS || 500);

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForHealth() {
  for (let i = 0; i < RETRIES; i++) {
    try {
      const res = await fetch(HEALTH_URL);
      if (res.ok) return true;
    } catch (e) { /* ignore */ }
    await wait(RETRY_DELAY_MS);
  }
  return false;
}

(async () => {
  // If a server is already running and healthy, don't spawn another one.
  try {
    const alreadyHealthy = await waitForHealth();
    if (alreadyHealthy) {
      console.log('Detected existing healthy server — starting simulator only');
      const simOnly = spawn(SIM_CMD, SIM_ARGS, { stdio: 'inherit', env: process.env });
      simOnly.on('exit', (code) => {
        console.log('Simulator exited with', code);
        process.exit(code || 0);
      });
      return;
    }
  } catch (e) {
    // ignore and proceed to spawn server
  }

  console.log('Starting server:', SERVER_CMD, SERVER_ARGS.join(' '));
  const server = spawn(SERVER_CMD, SERVER_ARGS, { stdio: 'inherit', env: process.env });

  process.on('SIGINT', () => {
    console.log('Stopping...');
    server.kill('SIGINT');
    process.exit(0);
  });

  console.log('Waiting for server health...');
  const ok = await waitForHealth();
  if (!ok) {
    console.error('Server did not respond to health checks. Simulate aborted.');
    server.kill();
    process.exit(1);
  }

  console.log('Server is healthy — starting simulator:', SIM_CMD, SIM_ARGS.join(' '));
  const sim = spawn(SIM_CMD, SIM_ARGS, { stdio: 'inherit', env: process.env });

  sim.on('exit', (code) => {
    console.log('Simulator exited with', code);
  });

  server.on('exit', (code) => {
    console.log('Server exited with', code, '— killing simulator');
    sim.kill();
    process.exit(code || 0);
  });
})();
