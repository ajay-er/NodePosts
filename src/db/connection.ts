import mongoose from 'mongoose';

mongoose.connection.once('open', () => {
  console.log('Database connection ready!☁️');
});

mongoose.connection.on('error', (err) => {
  console.error('Database not connected🫡!!!', err);
});

async function mongoConnect(URI: string) {
  await mongoose.connect(URI);
}

export default mongoConnect;
