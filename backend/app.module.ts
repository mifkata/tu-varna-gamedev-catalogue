import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';

import { GameDeveloperController } from '@backend/controllers/game-developer.controller';
import { HealthController } from '@backend/controllers/health.controller';
import { GameDeveloper } from '@backend/entities/GameDeveloper.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.get('database'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([GameDeveloper]),
  ],
  controllers: [HealthController, GameDeveloperController],
  providers: [],
})
export class AppModule {}
