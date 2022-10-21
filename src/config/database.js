import mongoose from 'mongoose';

const URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`;

export const dbConnection = () => {
  mongoose.connect(URI).then((conn) => {
    console.log(`Database Connected : ${conn.connection.host}`);
  });
};
