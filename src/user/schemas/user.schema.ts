import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  role: String,
  password: String,
  deletedAt: Date,
});
