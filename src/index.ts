import { env } from '@/common/utils/envConfig';
import { app, logger } from '@/server';

import mongoConnect from './db/connection';

const startServer = async () => {
  try {
    const { NODE_ENV, HOST, PORT, MONGO_URI } = env;

    await mongoConnect(MONGO_URI);

    const server = app.listen(env.PORT, () => {
      logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
    });

    const onCloseSignal = () => {
      logger.info('sigint received, shutting down');
      server.close(() => {
        logger.info('server closed');
        process.exit();
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    // Handle SIGINT and SIGTERM signals
    process.on('SIGINT', onCloseSignal);
    process.on('SIGTERM', onCloseSignal);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with an error status
  }
};

startServer();
