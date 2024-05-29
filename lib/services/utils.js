const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const config = require('../config');

function appendCreatedAt (obj) {
  Object.assign(obj, {
    createdAt: (new Date()).toString()
  });
}

function appendUpdatedAt (obj) {
  Object.assign(obj, {
    updatedAt: (new Date()).toString()
  });
}

function encrypt (text) {
  const { algorithm, cipherKey } = config.systemConfig.crypto;
  const iv = crypto.randomBytes(16);
  const password = crypto.pbkdf2Sync(cipherKey, iv.toString(), 10000, 32, 'sha512');
  const cipher = crypto.createCipheriv(algorithm, password, iv);
  return iv.toString('hex') + ':' + cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt (password) {
  const { algorithm, cipherKey } = config.systemConfig.crypto;
  const splitted = password.split(':');
  const iv = Buffer.from(splitted.shift(), 'hex');
  const passwd = crypto.pbkdf2Sync(cipherKey, iv.toString(), 10000, 32, 'sha512');
  const decipher = crypto.createDecipheriv(algorithm, passwd, iv);
  return decipher.update(splitted.join(':'), 'hex', 'utf8') + decipher.final('utf8');
}

function compareSaltAndHashed (password, hash) {
  return (!password || !hash) ? null : bcrypt.compare(password, hash);
}

function saltAndHash (password) {
  if (!password || typeof password !== 'string') {
    return Promise.reject(new Error('invalid arguments'));
  }

  return bcrypt
    .genSalt(config.systemConfig.crypto.saltRounds)
    .then((salt) => bcrypt.hash(password, salt));
}

module.exports = {
  appendCreatedAt,
  appendUpdatedAt,
  encrypt,
  decrypt,
  compareSaltAndHashed,
  saltAndHash
};
