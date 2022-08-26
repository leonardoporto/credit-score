import * as mongoose from 'mongoose';

export const DebtSchema = new mongoose.Schema({
  userId: String,
  description: String,
  amount: Number,
  deletedAt: Date,
});
