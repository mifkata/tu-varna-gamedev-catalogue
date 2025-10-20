import type { IAppConfig } from './config';

const config: Partial<IAppConfig> = {
  fastify: {
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      },
    },
  },
  database: {
    synchronize: true,
    logging: true,
  },
};

export default config;
