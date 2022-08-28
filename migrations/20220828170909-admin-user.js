// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

module.exports = {
  async up(db) {
    console.log(__filename);
    const admin = {
      name: 'Administrador',
      username: 'admin',
      role: 'admin',
      password: crypto
        .createHash('sha256')
        .update('1qaz2wsx', 'utf8')
        .digest('hex')
        .toString(),
    };

    await db.collection('users').insertOne(admin);
  },
};
