/**
 * Seed script – creates an initial admin user in MongoDB.
 * Run: npm run seed
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cineverse';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['USER', 'THEATRE_OWNER', 'ADMIN'], default: 'USER' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const SEED_USERS = [
  { name: 'Admin',         email: 'admin@cineverse.test',  password: 'admin123',    role: 'ADMIN' },
  { name: 'Theatre Owner', email: 'owner@cineverse.test',  password: 'owner123',    role: 'THEATRE_OWNER' },
  { name: 'Demo User',     email: 'user@cineverse.test',   password: 'user123',     role: 'USER' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  for (const userData of SEED_USERS) {
    const exists = await User.findOne({ email: userData.email });
    if (exists) {
      console.log(`  ✓ ${userData.email} already exists, skipping`);
      continue;
    }
    const hashed = await bcrypt.hash(userData.password, 10);
    await User.create({ ...userData, password: hashed });
    console.log(`  + Created ${userData.email} (${userData.role})`);
  }

  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
