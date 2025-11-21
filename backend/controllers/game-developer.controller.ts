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
import { GameDeveloper } from '../entities/GameDeveloper.entity';
import {
  GameDeveloperSchema,
  type CreateGameDeveloperDto,
  type UpdateGameDeveloperDto,
  type BulkDeleteGameDeveloperDto,
} from '../schemas/game-developer.schema';

@Controller('game-developers')
export class GameDeveloperController {
  constructor(
    @InjectRepository(GameDeveloper)
    private readonly gameDeveloperRepository: Repository<GameDeveloper>,
  ) {}

  @Post()
  @RouteSchema({
    tags: ['Game Developers'],
    body: GameDeveloperSchema.create(),
    response: {
      201: GameDeveloperSchema.response(),
    },
  })
  async create(@Body() createDto: CreateGameDeveloperDto) {
    const gameDeveloper = this.gameDeveloperRepository.create(createDto);
    return this.gameDeveloperRepository.save(gameDeveloper);
  }

  @Get()
  @RouteSchema({
    tags: ['Game Developers'],
    response: {
      200: GameDeveloperSchema.list(),
    },
  })
  async findAll() {
    const developers = await this.gameDeveloperRepository
      .createQueryBuilder('developer')
      .loadRelationCountAndMap('developer.gamesCount', 'developer.games')
      .orderBy('developer.createdAt', 'DESC')
      .getMany();

    return developers;
  }

  @Get(':id')
  @RouteSchema({
    tags: ['Game Developers'],
    params: GameDeveloperSchema.id(),
    response: {
      200: GameDeveloperSchema.response(),
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
    tags: ['Game Developers'],
    params: GameDeveloperSchema.id(),
    body: GameDeveloperSchema.update(),
    response: {
      200: GameDeveloperSchema.response(),
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

  @Post('bulk-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteSchema({
    tags: ['Game Developers'],
    body: GameDeveloperSchema.bulkDelete(),
  })
  async bulkRemove(@Body() bulkDeleteDto: BulkDeleteGameDeveloperDto) {
    const { ids } = bulkDeleteDto;

    const gameDevelopers = await this.gameDeveloperRepository.findByIds(ids);

    if (gameDevelopers.length !== ids.length) {
      const foundIds = gameDevelopers.map((dev) => dev.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Game developers with IDs ${missingIds.join(', ')} not found`);
    }

    await this.gameDeveloperRepository.remove(gameDevelopers);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteSchema({
    tags: ['Game Developers'],
    params: GameDeveloperSchema.id(),
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
