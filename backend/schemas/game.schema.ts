import { Type, Static } from '@sinclair/typebox';

export class GameSchema {
  // Params schemas
  static id() {
    return Type.Object(
      {
        id: Type.String({
          format: 'uuid',
          description: 'UUID parameter',
        }),
      },
      { $id: 'GameUuidParam' },
    );
  }

  // Request schemas
  static create() {
    return Type.Object(
      {
        name: Type.String({
          minLength: 1,
          maxLength: 255,
          description: 'The name of the game',
        }),
        developerId: Type.String({
          format: 'uuid',
          description: 'The UUID of the game developer',
        }),
        categoryId: Type.String({
          format: 'uuid',
          description: 'The UUID of the category',
        }),
        minCpu: Type.Number({
          minimum: 0,
          description: 'Minimum CPU requirement (GHz)',
        }),
        minMemory: Type.Integer({
          minimum: 0,
          description: 'Minimum memory requirement (MB)',
        }),
        multiplayer: Type.Boolean({
          description: 'Whether the game supports multiplayer',
          default: false,
        }),
        releaseYear: Type.Integer({
          minimum: 1970,
          maximum: 2100,
          description: 'The year the game was released',
        }),
        price: Type.Number({
          minimum: 0,
          description: 'The price of the game',
        }),
      },
      { $id: 'CreateGame' },
    );
  }

  static update() {
    return Type.Object(
      {
        name: Type.Optional(
          Type.String({
            minLength: 1,
            maxLength: 255,
            description: 'The name of the game',
          }),
        ),
        developerId: Type.Optional(
          Type.String({
            format: 'uuid',
            description: 'The UUID of the game developer',
          }),
        ),
        categoryId: Type.Optional(
          Type.String({
            format: 'uuid',
            description: 'The UUID of the category',
          }),
        ),
        minCpu: Type.Optional(
          Type.Number({
            minimum: 0,
            description: 'Minimum CPU requirement (GHz)',
          }),
        ),
        minMemory: Type.Optional(
          Type.Integer({
            minimum: 0,
            description: 'Minimum memory requirement (MB)',
          }),
        ),
        multiplayer: Type.Optional(
          Type.Boolean({
            description: 'Whether the game supports multiplayer',
          }),
        ),
        releaseYear: Type.Optional(
          Type.Integer({
            minimum: 1970,
            maximum: 2100,
            description: 'The year the game was released',
          }),
        ),
        price: Type.Optional(
          Type.Number({
            minimum: 0,
            description: 'The price of the game',
          }),
        ),
      },
      { $id: 'UpdateGame' },
    );
  }

  static bulkDelete() {
    return Type.Object(
      {
        ids: Type.Array(
          Type.String({
            format: 'uuid',
            description: 'UUID of a game to delete',
          }),
          {
            minItems: 1,
            description: 'Array of game IDs to delete',
          },
        ),
      },
      { $id: 'BulkDeleteGame' },
    );
  }

  // Nested object schemas
  static developerNested() {
    return Type.Object({
      id: Type.String({ format: 'uuid' }),
      name: Type.String(),
    });
  }

  static categoryNested() {
    return Type.Object({
      id: Type.String({ format: 'uuid' }),
      name: Type.String(),
    });
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
          description: 'The name of the game',
        }),
        developer: this.developerNested(),
        category: this.categoryNested(),
        minCpu: Type.Number({
          description: 'Minimum CPU requirement (GHz)',
        }),
        minMemory: Type.Number({
          description: 'Minimum memory requirement (MB)',
        }),
        multiplayer: Type.Boolean({
          description: 'Whether the game supports multiplayer',
        }),
        releaseYear: Type.Number({
          description: 'The year the game was released',
        }),
        price: Type.Number({
          description: 'The price of the game',
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
      { $id: 'GameResponse' },
    );
  }

  static list() {
    return Type.Array(this.response(), {
      $id: 'GameList',
    });
  }
}

// Export TypeScript types
export type UuidParam = Static<ReturnType<typeof GameSchema.id>>;
export type CreateGameDto = Static<ReturnType<typeof GameSchema.create>>;
export type UpdateGameDto = Static<ReturnType<typeof GameSchema.update>>;
export type BulkDeleteGameDto = Static<ReturnType<typeof GameSchema.bulkDelete>>;
export type GameResponse = Static<ReturnType<typeof GameSchema.response>>;
