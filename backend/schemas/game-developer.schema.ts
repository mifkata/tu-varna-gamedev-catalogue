import { Type, Static } from '@sinclair/typebox';

// Params schemas
export const uuidParamSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'UUID parameter',
    }),
  },
  { $id: 'UuidParam' },
);

// Request schemas
export const createGameDeveloperSchema = Type.Object(
  {
    name: Type.String({
      minLength: 1,
      maxLength: 255,
      description: 'The name of the game developer',
    }),
  },
  { $id: 'CreateGameDeveloper' },
);

export const updateGameDeveloperSchema = Type.Object(
  {
    name: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 255,
        description: 'The name of the game developer',
      }),
    ),
  },
  { $id: 'UpdateGameDeveloper' },
);

export const bulkDeleteGameDeveloperSchema = Type.Object(
  {
    ids: Type.Array(
      Type.String({
        format: 'uuid',
        description: 'UUID of a game developer to delete',
      }),
      {
        minItems: 1,
        description: 'Array of game developer IDs to delete',
      },
    ),
  },
  { $id: 'BulkDeleteGameDeveloper' },
);

// Response schemas
export const gameDeveloperResponseSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'The unique identifier',
    }),
    name: Type.String({
      description: 'The name of the game developer',
    }),
    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation timestamp',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Last update timestamp',
    }),
  },
  { $id: 'GameDeveloperResponse' },
);

export const gameDeveloperListItemSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'The unique identifier',
    }),
    name: Type.String({
      description: 'The name of the game developer',
    }),
    gamesCount: Type.Number({
      description: 'The number of games by this developer',
    }),
    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation timestamp',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Last update timestamp',
    }),
  },
  { $id: 'GameDeveloperListItem' },
);

export const gameDeveloperListResponseSchema = Type.Array(gameDeveloperListItemSchema, {
  $id: 'GameDeveloperList',
});

// Export TypeScript types
export type UuidParam = Static<typeof uuidParamSchema>;
export type CreateGameDeveloperDto = Static<typeof createGameDeveloperSchema>;
export type UpdateGameDeveloperDto = Static<typeof updateGameDeveloperSchema>;
export type BulkDeleteGameDeveloperDto = Static<typeof bulkDeleteGameDeveloperSchema>;
export type GameDeveloperResponse = Static<typeof gameDeveloperResponseSchema>;
export type GameDeveloperListItem = Static<typeof gameDeveloperListItemSchema>;
