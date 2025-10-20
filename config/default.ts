import 'dotenv/config';
import type { IAppConfig } from './config';

const config: IAppConfig = {
  env: 'development',
  fastify: {
    logger: true,
  },
  app: {
    port: 3000,
    apiPrefix: 'api',
    loadFrontend: true,
    startListening: true,
  },
  database: {
    type: 'postgres',
    synchronize: false,
    logging: false,
  },
};

export default config;
