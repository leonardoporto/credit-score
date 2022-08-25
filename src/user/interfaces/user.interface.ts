import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly name: string;
  readonly username: string;
  readonly role: 'admin' | 'customer';
  readonly password: string;
  readonly deletedAt: Date;
}
