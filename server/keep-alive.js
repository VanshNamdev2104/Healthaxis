// Keep-alive script to prevent Render from sleeping
// Run this with cron job or similar service

import https from 'https';

const RENDER_URL = 'https://healthaxis-14r9.onrender.com/health';

function ping() {
  https.get(RENDER_URL, (res) => {
    console.log(`[${new Date().toISOString()}] Health check: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Health check failed:`, err.message);
  });
}

// Ping every 14 minutes (Render sleeps after 15 minutes of inactivity)
ping();
setInterval(ping, 14 * 60 * 1000);
