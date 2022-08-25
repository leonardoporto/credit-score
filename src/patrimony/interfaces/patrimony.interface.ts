import { Document } from 'mongoose';

export interface Patrimony extends Document {
  readonly _id: string;
  readonly userId: string;
  readonly description: string;
  readonly amount: number;
  readonly deletedAt: Date;
}
