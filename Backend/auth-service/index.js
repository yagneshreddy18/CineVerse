const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// ── Config ──────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cineverse';
const JWT_SECRET = process.env.JWT_SECRET || 'cineverse_jwt_secret_change_in_production';
const PORT = process.env.PORT || 3000;

// ── Mongoose User model ─────────────────────────────────
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['USER', 'THEATRE_OWNER', 'ADMIN'], default: 'USER' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user object (no password)
userSchema.methods.toPublic = function () {
  const { _id, name, email, role, createdAt } = this.toObject();
  return { id: _id.toString(), name, email, role, createdAt };
};

const User = mongoose.model('User', userSchema);

// ── Express app ─────────────────────────────────────────
const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());

// Helper: create JWT
function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
}

// Helper: auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Routes ──────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, role: role || 'USER' });
    const token = signToken(user);
    return res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user);
    return res.json({ token, user: user.toPublic() });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user (protected)
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: user.toPublic() });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Health check
app.get('/api/auth/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ── Start ───────────────────────────────────────────────
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB:', MONGO_URI);
    app.listen(PORT, () => console.log(`Auth service listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
