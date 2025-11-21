import { Type, Static } from '@sinclair/typebox';

export class CategorySchema {
  // Params schemas
  static id() {
    return Type.Object(
      {
        id: Type.String({
          format: 'uuid',
          description: 'UUID parameter',
        }),
      },
      { $id: 'CategoryUuidParam' },
    );
  }

  // Request schemas
  static create() {
    return Type.Object(
      {
        name: Type.String({
          minLength: 1,
          maxLength: 255,
          description: 'The name of the category',
        }),
      },
      { $id: 'CreateCategory' },
    );
  }

  static update() {
    return Type.Object(
      {
        name: Type.Optional(
          Type.String({
            minLength: 1,
            maxLength: 255,
            description: 'The name of the category',
          }),
        ),
      },
      { $id: 'UpdateCategory' },
    );
  }

  static bulkDelete() {
    return Type.Object(
      {
        ids: Type.Array(
          Type.String({
            format: 'uuid',
            description: 'UUID of a category to delete',
          }),
          {
            minItems: 1,
            description: 'Array of category IDs to delete',
          },
        ),
      },
      { $id: 'BulkDeleteCategory' },
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
          description: 'The name of the category',
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
      { $id: 'CategoryResponse' },
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
          description: 'The name of the category',
        }),
        gamesCount: Type.Number({
          description: 'The number of games in this category',
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
      { $id: 'CategoryListItem' },
    );
  }

  static list() {
    return Type.Array(this.listItem(), {
      $id: 'CategoryList',
    });
  }
}

// Export TypeScript types
export type UuidParam = Static<ReturnType<typeof CategorySchema.id>>;
export type CreateCategoryDto = Static<ReturnType<typeof CategorySchema.create>>;
export type UpdateCategoryDto = Static<ReturnType<typeof CategorySchema.update>>;
export type BulkDeleteCategoryDto = Static<ReturnType<typeof CategorySchema.bulkDelete>>;
export type CategoryResponse = Static<ReturnType<typeof CategorySchema.response>>;
export type CategoryListItem = Static<ReturnType<typeof CategorySchema.listItem>>;
