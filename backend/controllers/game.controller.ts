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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RouteSchema } from '../decorators/route-schema.decorator';
import { Category } from '../entities/Category.entity';
import { Game } from '../entities/Game.entity';
import { GameDeveloper } from '../entities/GameDeveloper.entity';
import {
  GameSchema,
  type CreateGameDto,
  type UpdateGameDto,
  type BulkDeleteGameDto,
} from '../schemas/game.schema';

@Controller('games')
export class GameController {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameDeveloper)
    private readonly developerRepository: Repository<GameDeveloper>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Post()
  @RouteSchema({
    tags: ['Games'],
    body: GameSchema.create(),
    response: {
      201: GameSchema.response(),
    },
  })
  async create(@Body() createDto: CreateGameDto) {
    const developer = await this.developerRepository.findOne({
      where: { id: createDto.developerId },
    });

    if (!developer) {
      throw new NotFoundException(`Developer with ID ${createDto.developerId} not found`);
    }

    const category = await this.categoryRepository.findOne({
      where: { id: createDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${createDto.categoryId} not found`);
    }

    const game = this.gameRepository.create({
      name: createDto.name,
      developer,
      category,
      minCpu: createDto.minCpu,
      minMemory: createDto.minMemory,
      multiplayer: createDto.multiplayer,
      releaseYear: createDto.releaseYear,
      price: createDto.price,
      amount: createDto.amount,
    });

    return this.gameRepository.save(game);
  }

  @Get()
  @RouteSchema({
    tags: ['Games'],
    response: {
      200: GameSchema.list(),
    },
  })
  async findAll() {
    const games = await this.gameRepository.find({
      relations: ['developer', 'category'],
      order: { createdAt: 'DESC' },
    });

    return games;
  }

  @Get(':id')
  @RouteSchema({
    tags: ['Games'],
    params: GameSchema.id(),
    response: {
      200: GameSchema.response(),
    },
  })
  async findOne(@Param('id') id: string) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['developer', 'category'],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return game;
  }

  @Patch(':id')
  @RouteSchema({
    tags: ['Games'],
    params: GameSchema.id(),
    body: GameSchema.update(),
    response: {
      200: GameSchema.response(),
    },
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateGameDto) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['developer', 'category'],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    if (updateDto.developerId) {
      const developer = await this.developerRepository.findOne({
        where: { id: updateDto.developerId },
      });

      if (!developer) {
        throw new NotFoundException(`Developer with ID ${updateDto.developerId} not found`);
      }

      game.developer = developer;
    }

    if (updateDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${updateDto.categoryId} not found`);
      }

      game.category = category;
    }

    if (updateDto.name !== undefined) game.name = updateDto.name;
    if (updateDto.minCpu !== undefined) game.minCpu = updateDto.minCpu;
    if (updateDto.minMemory !== undefined) game.minMemory = updateDto.minMemory;
    if (updateDto.multiplayer !== undefined) game.multiplayer = updateDto.multiplayer;
    if (updateDto.releaseYear !== undefined) game.releaseYear = updateDto.releaseYear;
    if (updateDto.price !== undefined) game.price = updateDto.price;
    if (updateDto.amount !== undefined) game.amount = updateDto.amount;

    return this.gameRepository.save(game);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteSchema({
    tags: ['Games'],
    body: GameSchema.bulkDelete(),
  })
  async bulkRemove(@Body() bulkDeleteDto: BulkDeleteGameDto) {
    const { ids } = bulkDeleteDto;

    const games = await this.gameRepository.findByIds(ids);

    if (games.length !== ids.length) {
      const foundIds = games.map((game) => game.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Games with IDs ${missingIds.join(', ')} not found`);
    }

    await this.gameRepository.remove(games);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteSchema({
    tags: ['Games'],
    params: GameSchema.id(),
  })
  async remove(@Param('id') id: string) {
    const game = await this.gameRepository.findOne({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    await this.gameRepository.remove(game);
  }
}
