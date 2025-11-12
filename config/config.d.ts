interface DbConfig {
  type?: 'postgres';
  synchronize?: boolean;
  logging?: boolean;
  entities?: string[];
}

interface DbConfigSeparate extends DbConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}

interface DbConfigUrl extends DbConfig {
  url?: string;
}

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
    paths?: {
      root?: string;
      frontend?: string;
      backend?: string;
    };
  };
  database: DbConfigSeparate | DbConfigUrl;
}
