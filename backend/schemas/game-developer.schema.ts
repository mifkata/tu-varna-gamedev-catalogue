export const createGameDeveloperSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      description: 'The name of the game developer',
    },
  },
} as const;

export const updateGameDeveloperSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      description: 'The name of the game developer',
    },
  },
} as const;

export const gameDeveloperResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The unique identifier',
    },
    name: {
      type: 'string',
      description: 'The name of the game developer',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Creation timestamp',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Last update timestamp',
    },
  },
} as const;

export const gameDeveloperListResponseSchema = {
  type: 'array',
  items: gameDeveloperResponseSchema,
} as const;
