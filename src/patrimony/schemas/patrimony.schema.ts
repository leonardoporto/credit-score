import * as mongoose from 'mongoose';

export const PatrimonySchema = new mongoose.Schema({
  description: String,
  amount: Number,
  deletedAt: Date,
});
