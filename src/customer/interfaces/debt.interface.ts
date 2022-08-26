import { Document } from 'mongoose';

export interface Debt extends Document {
  readonly _id: string;
  readonly userId: string;
  readonly description: string;
  readonly amount: number;
  readonly deletedAt: Date;
}
