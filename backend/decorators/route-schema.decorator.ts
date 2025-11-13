import { applyDecorators } from '@nestjs/common';
import { RouteSchema as RouteSchemaBase } from '@nestjs/platform-fastify';
import { FastifySchema } from 'fastify';

export interface OpenApiSchema extends FastifySchema {
  tags?: string[];
  summary?: string;
  description?: string;
  deprecated?: boolean;
}

export const RouteSchema = (schema: OpenApiSchema) => {
  return applyDecorators(RouteSchemaBase(schema));
};
