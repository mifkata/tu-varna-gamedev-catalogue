import 'reflect-metadata';
import '@fastify/swagger';

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

    // Register Fastify Swagger documentation UI
    if (this.env !== 'test') {
      await this.registerSwagger();
    }

    await this.app.init();

    this.logger.info('NestJS application initialized');
  }

  private async registerSwagger(): Promise<void> {
    const fastify = this.app.getHttpAdapter().getInstance();
    const swagger = (await import('@fastify/swagger')).default;
    const swaggerUI = (await import('@fastify/swagger-ui')).default;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    await fastify.register(swagger as any, {
      openapi: {
        info: {
          title: 'Game Developer Catalogue API',
          description: 'API for managing game developers, games, and inventory',
          version: '1.0.0',
        },
        tags: [{ name: 'Game Developers', description: 'Game developer operations' }],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    await fastify.register(swaggerUI as any, {
      routePrefix: '/api/docs',
    });
  }

  public async listen(host = '0.0.0.0'): Promise<void> {
    await this.app.listen(this.port, host);
    await this.app.getHttpAdapter().getInstance().ready();

    this.logger.info(`Application is running on: http://localhost:${this.port}`);
    this.logger.info(`Environment: ${this.env}`);
  }
}
