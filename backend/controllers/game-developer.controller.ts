import '@fastify/swagger';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { RouteSchema } from '@nestjs/platform-fastify/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameDeveloper } from '../entities/GameDeveloper.entity';
import {
  createGameDeveloperSchema,
  updateGameDeveloperSchema,
  gameDeveloperResponseSchema,
  gameDeveloperListResponseSchema,
} from '../schemas/game-developer.schema';

interface CreateGameDeveloperDto {
  name: string;
}

interface UpdateGameDeveloperDto {
  name?: string;
}

@Controller('game-developers')
export class GameDeveloperController {
  constructor(
    @InjectRepository(GameDeveloper)
    private readonly gameDeveloperRepository: Repository<GameDeveloper>,
  ) {}

  @Post()
  @RouteSchema({
    body: createGameDeveloperSchema,
    response: {
      201: gameDeveloperResponseSchema,
    },
  })
  async create(@Body() createDto: CreateGameDeveloperDto) {
    const gameDeveloper = this.gameDeveloperRepository.create(createDto);
    return this.gameDeveloperRepository.save(gameDeveloper);
  }

  @Get()
  @RouteSchema({
    response: {
      200: gameDeveloperListResponseSchema,
    },
  })
  async findAll() {
    return this.gameDeveloperRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  @Get(':id')
  @RouteSchema({
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
    response: {
      200: gameDeveloperResponseSchema,
    },
  })
  async findOne(@Param('id') id: string) {
    const gameDeveloper = await this.gameDeveloperRepository.findOne({
      where: { id },
    });

    if (!gameDeveloper) {
      throw new NotFoundException(`Game developer with ID ${id} not found`);
    }

    return gameDeveloper;
  }

  @Patch(':id')
  @RouteSchema({
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
    body: updateGameDeveloperSchema,
    response: {
      200: gameDeveloperResponseSchema,
    },
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateGameDeveloperDto) {
    const gameDeveloper = await this.gameDeveloperRepository.findOne({
      where: { id },
    });

    if (!gameDeveloper) {
      throw new NotFoundException(`Game developer with ID ${id} not found`);
    }

    Object.assign(gameDeveloper, updateDto);
    return this.gameDeveloperRepository.save(gameDeveloper);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteSchema({
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  async remove(@Param('id') id: string) {
    const gameDeveloper = await this.gameDeveloperRepository.findOne({
      where: { id },
    });

    if (!gameDeveloper) {
      throw new NotFoundException(`Game developer with ID ${id} not found`);
    }

    await this.gameDeveloperRepository.remove(gameDeveloper);
  }
}
