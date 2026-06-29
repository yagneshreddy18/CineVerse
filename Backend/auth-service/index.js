// Simple JWT authentication service
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
app.use(express.json());

// Load users from file (passwords are bcrypt hashes)
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
// Secret for signing JWTs – in production this should come from an env var
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn: '1h' });
  return res.json({ token });
});

// Example protected route
app.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ message: 'Access granted', user: payload.sub });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth service listening on port ${PORT}`));
