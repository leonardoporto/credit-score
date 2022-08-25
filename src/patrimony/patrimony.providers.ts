import { Connection } from 'mongoose';
import { PatrimonySchema } from './schemas/patrimony.schema';

export const patrimoniesProviders = [
  {
    provide: 'PATRIMONY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Patrimony', PatrimonySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
