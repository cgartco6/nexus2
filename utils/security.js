const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Encryption key (should be stored in environment variables)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your_secure_encryption_key';
const IV_LENGTH = 16;

// Encrypt data
function encryptData(data) {
  if (typeof data !== 'string') data = JSON.stringify(data);
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), 
    iv
  );
  
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Decrypt data
function decryptData(data) {
  const parts = data.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), 
    iv
  );
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare password
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// Verify JWT token
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  encryptData,
  decryptData,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
};
