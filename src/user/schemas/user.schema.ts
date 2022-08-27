import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

export const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  role: String,
  password: {
    type: String,
    set: (password) => {
      return crypto
        .createHash('sha256')
        .update(password, 'utf8')
        .digest('hex')
        .toString();
    },
  },
  deletedAt: Date,
});
