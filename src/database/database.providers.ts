import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        process.env.NODE_ENV !== 'test'
          ? process.env.MONGODB_URI
          : process.env.MONGO_URI_TEST,
      ),
  },
];
