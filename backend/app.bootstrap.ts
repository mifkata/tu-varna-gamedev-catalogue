import 'reflect-metadata';

import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import config from 'config';
import type { FastifyBaseLogger } from 'fastify';
import next from 'next';

import { AppModule } from '@backend/app.module';

export class AppBootstrap {
  private _app: NestFastifyApplication | null = null;
  private nextApp: ReturnType<typeof next> | null = null;
  private env = config.get<string>('env');

  private constructor() {}

  public get app(): NestFastifyApplication {
    return this._app!;
  }

  public get logger(): FastifyBaseLogger {
    return this.app.getHttpAdapter().getInstance().log;
  }

  private async initializeBackend(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const fastifyOptions: any = config.get('fastify');
    const fastifyAdapter = new FastifyAdapter(fastifyOptions);

    this._app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
    this.app.setGlobalPrefix(config.get<string>('app.apiPrefix'));

    // Enable CORS if needed
    this.app.enableCors();

    await this.app.init();
    await this.app.getHttpAdapter().getInstance().ready();

    this.logger.info('NestJS application initialized');
  }

  private async initializeFrontend(): Promise<void> {
    const dir = join(process.cwd(), 'frontend');

    this.nextApp = next({ dev: this.env === 'development', dir });
    await this.nextApp.prepare();

    this.logger.info(`Next.js initialized in ${this.env} mode`);

    if (!this.app || !this.nextApp) {
      throw new Error('Application not initialized');
    }

    const handle = this.nextApp.getRequestHandler();
    const fastify = this.app.getHttpAdapter().getInstance();

    fastify.get('/*', async (req, reply) => {
      if (req.url.startsWith('/api/')) {
        return;
      }

      await handle(req.raw, reply.raw);
      reply.sent = true;
    });

    this.logger.info('Next.js request handler configured');
  }

  public async start(): Promise<void> {
    try {
      await this.initializeBackend();

      if (config.get<boolean>('app.loadFrontend')) {
        await this.initializeFrontend();
      }

      if (config.get<boolean>('app.startListening')) {
        const port = config.get<number>('app.port');

        await this.app.listen(port, '0.0.0.0');
        this.logger.info(`Application is running on: http://localhost:${port}`);
        this.logger.info(`Environment: ${this.env}`);
      }
    } catch (error: unknown) {
      this.logger.error(error, 'Error during application bootstrap:');
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    if (this.app) {
      await this.app.close();
      this.logger.info('Application shut down gracefully');
    }
  }

  public static async bootstrap(): Promise<AppBootstrap> {
    const app = new AppBootstrap();
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
