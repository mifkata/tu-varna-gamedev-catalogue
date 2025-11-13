import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Type } from '@sinclair/typebox';
import { DataSource } from 'typeorm';

import { RouteSchema } from '@backend/decorators/route-schema.decorator';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @RouteSchema({
    tags: ['Health'],
    response: {
      200: Type.Object({
        status: Type.String({ example: 'ok' }),
        timestamp: Type.String({ format: 'date-time', example: '2025-11-10T00:00:00Z' }),
        uptime: Type.Number({ example: 12345 }),
      }),
    },
  })
  public async check(): Promise<{ status: string; timestamp: string; uptime: number }> {
    await this.dataSource.query('SELECT 1');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
