const http = require('http');
const PORT = process.env.PORT || 8000;

http.createServer(async (req, res) => {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  const u = new URL(req.url, 'http://x');
  const t = u.searchParams.get('url');
  if (!t) {
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('relay ok. use /?url=<encoded target>');
    return;
  }
  try {
    const r = await fetch(t, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'text/html,application/json,*/*',
        'accept-language': 'en-US,en;q=0.9'
      }
    });
    const buf = Buffer.from(await r.arrayBuffer());
    res.statusCode = r.status;
    res.setHeader('content-type', r.headers.get('content-type') || 'application/octet-stream');
    res.end(buf);
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('proxy error: ' + e.message);
  }
}).listen(PORT, () => console.log('listening on ' + PORT));
