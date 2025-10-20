import type { IAppConfig } from './config.d';

const config: Partial<IAppConfig> = {
  env: 'test',
  fastify: {
    logger: false,
  },
  app: {
    startListening: false,
    loadFrontend: false,
  },
  database: {
    synchronize: true,
  },
};

export default config;
