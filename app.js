const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Node.js Demo</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 50px; }
            h1 { color: #2ecc71; }
          </style>
        </head>
        <body>
          <h1>Welcome to Node.js!</h1>
          <p>Current time: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    return;
  }

  if (req.url === '/json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Hello from Node.js!',
      time: new Date().toISOString(),
      random: Math.floor(Math.random() * 100)
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });

  if (req.url === '/time') {
    res.end(`Current time: ${new Date().toLocaleString()}`);
  } else if (req.url === '/random') {
    res.end(`Random number: ${Math.floor(Math.random() * 100)}`);
  } else if (req.url === '/greet') {
    const name = new URL(req.url, `http://${req.headers.host}`).searchParams.get('name') || 'Guest';
    res.end(`Hello, ${name}!`);
  } else {
    res.end('Hello, World!');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
