import { setCorsHeaders } from './_db.js';

export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Gracefully acknowledge SSE stream requests on serverless deployment
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive'
  });
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'serverless_active', timestamp: new Date().toISOString() })}\n\n`);
  res.end();
}
