import { Type, Static } from '@sinclair/typebox';

export class GameDeveloperSchema {
  // Params schemas
  static uuidParam() {
    return Type.Object(
      {
        id: Type.String({
          format: 'uuid',
          description: 'UUID parameter',
        }),
      },
      { $id: 'UuidParam' },
    );
  }

  // Request schemas
  static create() {
    return Type.Object(
      {
        name: Type.String({
          minLength: 1,
          maxLength: 255,
          description: 'The name of the game developer',
        }),
      },
      { $id: 'CreateGameDeveloper' },
    );
  }

  static update() {
    return Type.Object(
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
  }

  static bulkDelete() {
    return Type.Object(
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
  }

  // Response schemas
  static response() {
    return Type.Object(
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
  }

  static listItem() {
    return Type.Object(
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
  }

  static list() {
    return Type.Array(this.listItem(), {
      $id: 'GameDeveloperList',
    });
  }
}

// Export TypeScript types
export type UuidParam = Static<ReturnType<typeof GameDeveloperSchema.uuidParam>>;
export type CreateGameDeveloperDto = Static<ReturnType<typeof GameDeveloperSchema.create>>;
export type UpdateGameDeveloperDto = Static<ReturnType<typeof GameDeveloperSchema.update>>;
export type BulkDeleteGameDeveloperDto = Static<ReturnType<typeof GameDeveloperSchema.bulkDelete>>;
export type GameDeveloperResponse = Static<ReturnType<typeof GameDeveloperSchema.response>>;
export type GameDeveloperListItem = Static<ReturnType<typeof GameDeveloperSchema.listItem>>;
