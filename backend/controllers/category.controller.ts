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
import {
  CategorySchema,
  type CreateCategoryDto,
  type UpdateCategoryDto,
  type BulkDeleteCategoryDto,
} from '../schemas/category.schema';

@Controller('categories')
export class CategoryController {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Post()
  @RouteSchema({
    tags: ['Categories'],
    body: CategorySchema.create(),
    response: {
      201: CategorySchema.response(),
    },
  })
  async create(@Body() createDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createDto);
    return this.categoryRepository.save(category);
  }

  @Get()
  @RouteSchema({
    tags: ['Categories'],
    response: {
      200: CategorySchema.list(),
    },
  })
  async findAll() {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.gamesCount', 'category.games')
      .orderBy('category.createdAt', 'DESC')
      .getMany();

    return categories;
  }

  @Get(':id')
  @RouteSchema({
    tags: ['Categories'],
    params: CategorySchema.id(),
    response: {
      200: CategorySchema.response(),
    },
  })
  async findOne(@Param('id') id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  @Patch(':id')
  @RouteSchema({
    tags: ['Categories'],
    params: CategorySchema.id(),
    body: CategorySchema.update(),
    response: {
      200: CategorySchema.response(),
    },
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    Object.assign(category, updateDto);
    return this.categoryRepository.save(category);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteSchema({
    tags: ['Categories'],
    body: CategorySchema.bulkDelete(),
  })
  async bulkRemove(@Body() bulkDeleteDto: BulkDeleteCategoryDto) {
    const { ids } = bulkDeleteDto;

    const categories = await this.categoryRepository.findByIds(ids);

    if (categories.length !== ids.length) {
      const foundIds = categories.map((cat) => cat.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Categories with IDs ${missingIds.join(', ')} not found`);
    }

    await this.categoryRepository.remove(categories);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteSchema({
    tags: ['Categories'],
    params: CategorySchema.id(),
  })
  async remove(@Param('id') id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.remove(category);
  }
}
