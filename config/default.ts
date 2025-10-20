import 'dotenv/config';
import path from 'path';
import type { IAppConfig } from './config';

const root = path.resolve(__dirname, '..');

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
    paths: {
      root,
      frontend: path.join(root, 'frontend'),
      backend: path.join(root, 'backend'),
    },
  },
  database: {
    type: 'postgres',
    synchronize: false,
    logging: false,
  },
};

export default config;
