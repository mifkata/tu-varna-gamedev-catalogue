import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';

import { CategoryController } from '@backend/controllers/category.controller';
import { GameDeveloperController } from '@backend/controllers/game-developer.controller';
import { HealthController } from '@backend/controllers/health.controller';
import { Category } from '@backend/entities/Category.entity';
import { GameDeveloper } from '@backend/entities/GameDeveloper.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.get('database'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([GameDeveloper, Category]),
  ],
  controllers: [HealthController, GameDeveloperController, CategoryController],
  providers: [],
})
export class AppModule {}
