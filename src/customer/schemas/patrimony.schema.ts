import * as mongoose from 'mongoose';

export const PatrimonySchema = new mongoose.Schema({
  userId: String,
  description: String,
  amount: Number,
  deletedAt: Date,
});
