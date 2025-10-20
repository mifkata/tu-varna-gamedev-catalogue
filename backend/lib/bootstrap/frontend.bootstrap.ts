import 'reflect-metadata';

import { NestFastifyApplication } from '@nestjs/platform-fastify';
import config from 'config';
import type { FastifyBaseLogger } from 'fastify';
import next from 'next';

type NextApp = ReturnType<typeof next>;

export class FrontendBootstrap {
  private _app: NextApp | null = null;
  private env = config.get<string>('env');

  constructor(private readonly backendApp: NestFastifyApplication) {}

  public get app(): ReturnType<typeof next> {
    return this._app!;
  }

  public get logger(): FastifyBaseLogger {
    return this.backendApp.getHttpAdapter().getInstance().log;
  }

  public async init(): Promise<void> {
    const dir = config.get<string>('app.paths.frontend');

    this._app = next({ dev: this.env === 'development', dir });
    await this.app.prepare();

    this.logger.info(`Next.js initialized in ${this.env} mode`);
    this.configureNextJsRequestHandler();
  }

  private configureNextJsRequestHandler(): void {
    if (!this.app || !this.backendApp) {
      throw new Error('Application not initialized');
    }

    const handle = this.app.getRequestHandler();
    const fastify = this.backendApp.getHttpAdapter().getInstance();

    fastify.get('/*', async (req, reply) => {
      if (req.url.startsWith('/api/')) {
        return;
      }

      await handle(req.raw, reply.raw);
      reply.sent = true;
    });

    this.logger.info('Next.js request handler configured');
  }
}
