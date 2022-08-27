import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose
    .connect(process.env.MONGO_URI_TEST, { retryWrites: false })
    .catch((error) => console.error(error));
});

beforeEach(async () => {
  if (mongoose.connection.readyState !== 0 && process.env.NODE_ENV === 'test') {
    const { collections } = mongoose.connection;

    const promises = Object.keys(collections).map((collection) =>
      mongoose.connection.collection(collection).deleteMany({}),
    );

    await Promise.all(promises);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
