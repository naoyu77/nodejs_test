const http = require('http');

const server = http.createServer((req, res) => {
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
