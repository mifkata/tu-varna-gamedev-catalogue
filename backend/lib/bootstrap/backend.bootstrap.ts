import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import config from 'config';
import type { FastifyBaseLogger } from 'fastify';

import { AppModule } from '@backend/app.module';

export class BackendBootstrap {
  private _app: NestFastifyApplication | null = null;
  private port = config.get<number>('app.port');
  private env = config.get<string>('env');

  public get app(): NestFastifyApplication {
    return this._app!;
  }

  public get logger(): FastifyBaseLogger {
    return this.app.getHttpAdapter().getInstance().log;
  }

  public async init(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const fastifyOptions = config.get<any>('fastify');
    const fastifyAdapter = new FastifyAdapter(fastifyOptions);

    this._app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
    this.app.setGlobalPrefix(config.get<string>('app.apiPrefix'));

    // Enable CORS if needed
    this.app.enableCors();

    await this.app.init();
    await this.app.getHttpAdapter().getInstance().ready();

    this.logger.info('NestJS application initialized');
  }

  public async listen(host = '0.0.0.0'): Promise<void> {
    await this.app.listen(this.port, host);
    this.logger.info(`Application is running on: http://localhost:${this.port}`);
    this.logger.info(`Environment: ${this.env}`);
  }
}
