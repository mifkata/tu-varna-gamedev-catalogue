import type {} from 'fastify';
import type { FastifySchema } from '@fastify/swagger';

declare module 'fastify' {
  interface FastifySchema {
    openapi?: FastifySchema;
  }
}
