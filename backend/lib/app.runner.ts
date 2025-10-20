import 'reflect-metadata';

import config from 'config';
import type { FastifyBaseLogger } from 'fastify';

import { BackendBootstrap } from './bootstrap/backend.bootstrap';
import { FrontendBootstrap } from './bootstrap/frontend.bootstrap';

export class AppRunner {
  private _backend: BackendBootstrap;
  private _frontend: FrontendBootstrap;

  public get logger(): FastifyBaseLogger {
    return this.backend.app.getHttpAdapter().getInstance().log;
  }

  public get backend(): BackendBootstrap {
    return this._backend;
  }

  public get frontend(): FrontendBootstrap {
    return this._frontend;
  }

  public async start(): Promise<void> {
    try {
      this._backend = new BackendBootstrap();
      await this.backend.init();

      if (config.get<boolean>('app.loadFrontend')) {
        this._frontend = new FrontendBootstrap(this.backend.app);
        await this.frontend.init();
      }

      if (config.get<boolean>('app.startListening')) {
        await this.backend.listen();
      }
    } catch (error: unknown) {
      this.logger.error(error, 'Error during application bootstrap:');
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    if (this.backend.app) {
      await this.backend.app.close();
      this.logger.info('Application shut down gracefully');
    }
  }

  public static async run(): Promise<AppRunner> {
    const app = new AppRunner();
    await app.start();

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      app.logger.warn('SIGTERM signal received: closing application gracefully');
      void app.shutdown().then(() => {
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      app.logger.warn('SIGINT signal received: closing application gracefully');
      void app.shutdown().then(() => {
        process.exit(0);
      });
    });

    return app;
  }
}
