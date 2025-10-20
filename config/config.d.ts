export interface IAppConfig {
  env: string;
  fastify: {
    logger: unknown;
  };
  app: {
    port?: number;
    apiPrefix?: string;
    loadFrontend?: boolean;
    startListening?: boolean;
  };
  database: {
    type?: 'postgres';
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    url?: string;
    synchronize?: boolean;
    logging?: boolean;
  };
}
