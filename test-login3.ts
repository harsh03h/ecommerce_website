import http from 'http';

const data = JSON.stringify({ email: 'test@example.com', password: 'password123', displayName: 'Test User' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body.substring(0, 200)));
});

req.on('error', error => console.error('Error:', error));
req.write(data);
req.end();
