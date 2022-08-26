import { Connection } from 'mongoose';
import { DebtSchema } from '../schemas';

export const debtsProviders = [
  {
    provide: 'DEBT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Debt', DebtSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
