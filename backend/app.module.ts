import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';

import { HealthController } from '@backend/controllers/health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.get('database'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
