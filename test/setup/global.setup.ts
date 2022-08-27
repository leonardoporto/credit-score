import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

export = async function globalSetup() {
  // Config to decided if an mongodb-memory-server instance should be used
  // it's needed in global space, because we don't want to create a new instance every test-suite
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI_TEST = uri.slice(0, uri.lastIndexOf('/'));
};
