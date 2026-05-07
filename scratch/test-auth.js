const http = require('http');

function request(path, method, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(resBody);
          resolve({ status: res.statusCode, data: parsed });
        } catch(e) {
          resolve({ status: res.statusCode, text: resBody });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('--- Testing Signup ---');
  
  // Test 1: Invalid payload
  const res1 = await request('/api/auth/signup', 'POST', { email: 'bad' });
  console.log('Invalid payload:', res1);

  // Test 2: Valid payload
  const validUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'STUDENT'
  };
  const res2 = await request('/api/auth/signup', 'POST', validUser);
  console.log('Valid signup:', res2);

  // Test 3: Duplicate email
  if (res2.status === 201) {
    const res3 = await request('/api/auth/signup', 'POST', validUser);
    console.log('Duplicate signup:', res3);
  }

  console.log('\n--- Testing Login ---');
  // Test 4: Valid login
  const res4 = await request('/api/auth/login', 'POST', {
    email: validUser.email,
    password: validUser.password
  });
  console.log('Valid login:', res4);

  // Test 5: Wrong password
  const res5 = await request('/api/auth/login', 'POST', {
    email: validUser.email,
    password: 'wrongpassword'
  });
  console.log('Wrong password:', res5);
}

run().catch(console.error);
