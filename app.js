const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

const COUNTER_FILE = './counter.txt';
const TODO_FILE = './todos.json';

function getTodos() {
  try {
    return JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2));
}

function getCounter() {
  try {
    return parseInt(fs.readFileSync(COUNTER_FILE, 'utf8')) || 0;
  } catch {
    return 0;
  }
}

function incrementCounter() {
  const count = getCounter() + 1;
  fs.writeFileSync(COUNTER_FILE, String(count));
  return count;
}

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

  if (req.url === '/headers') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.headers, null, 2));
    return;
  }

  if (req.url === '/uuid') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(crypto.randomUUID());
    return;
  }

  if (req.url === '/counter') {
    const count = incrementCounter();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Count: ${count}`);
    return;
  }

  // ToDo App
  if (req.url === '/todo') {
    const todos = getTodos();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ToDo List</title>
          <style>
            body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
            h1 { color: #3498db; }
            form { margin-bottom: 20px; }
            input[type="text"] { padding: 8px; width: 70%; }
            button { padding: 8px 16px; background: #3498db; color: white; border: none; cursor: pointer; }
            ul { list-style: none; padding: 0; }
            li { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
            .delete { color: #e74c3c; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1>ToDo List</h1>
          <form action="/todo/add" method="POST">
            <input type="text" name="task" placeholder="New task..." required>
            <button type="submit">Add</button>
          </form>
          <ul>
            ${todos.map((task, i) => `<li>${task} <a class="delete" href="/todo/delete?id=${i}">[x]</a></li>`).join('')}
          </ul>
        </body>
      </html>
    `);
    return;
  }

  if (req.url === '/todo/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const task = decodeURIComponent(body.split('=')[1] || '').replace(/\+/g, ' ');
      if (task) {
        const todos = getTodos();
        todos.push(task);
        saveTodos(todos);
      }
      res.writeHead(302, { 'Location': '/todo' });
      res.end();
    });
    return;
  }

  if (req.url.startsWith('/todo/delete')) {
    const id = parseInt(new URL(req.url, `http://${req.headers.host}`).searchParams.get('id'));
    const todos = getTodos();
    if (id >= 0 && id < todos.length) {
      todos.splice(id, 1);
      saveTodos(todos);
    }
    res.writeHead(302, { 'Location': '/todo' });
    res.end();
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
