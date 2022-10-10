const http = require('http');
const app = require('./app');

// prettier-ignore
const port = ((arg) => {
  const p = parseInt(arg, 10);
  if (Number.isNaN(p)) return false;
  if (p >= 0) return p;
  return false;
})(process.env.PORT) || 3000;
app.set('port', port);

const server = http.createServer(app);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

server.listen(port);
