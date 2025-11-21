import type { CategoryResponse, CategoryListItem } from '@backend/schemas/category.schema';
import { TestAgent, TestAppHelper } from '@backend/test/test-app.helper';

describe('/api/categories', () => {
  let request: TestAgent;
  let createdCategoryId: string;

  beforeAll(() => {
    request = TestAppHelper.agent!;
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request
        .post('/api/categories')
        .send({ name: 'Test Category' })
        .expect(201);

      const body = response.body as CategoryResponse;
      expect(body).toMatchObject({
        id: expect.any(String),
        name: 'Test Category',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      createdCategoryId = body.id;
    });

    it('should return 400 when name is missing', async () => {
      await request.post('/api/categories').send({}).expect(400);
    });
  });

  describe('GET /api/categories', () => {
    it('should return an array of categories', async () => {
      const response = await request.get('/api/categories').expect(200);

      const body = response.body as CategoryListItem[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        gamesCount: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const response = await request.get(`/api/categories/${createdCategoryId}`).expect(200);

      const body = response.body as CategoryResponse;
      expect(body).toMatchObject({
        id: createdCategoryId,
        name: 'Test Category',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when category not found', async () => {
      await request.get('/api/categories/550e8400-e29b-41d4-a716-446655440000').expect(404);
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should update a category', async () => {
      const response = await request
        .patch(`/api/categories/${createdCategoryId}`)
        .send({ name: 'Updated Category' })
        .expect(200);

      const body = response.body as CategoryResponse;
      expect(body).toMatchObject({
        id: createdCategoryId,
        name: 'Updated Category',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when category not found', async () => {
      await request
        .patch('/api/categories/550e8400-e29b-41d4-a716-446655440000')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('POST /api/categories/bulk-delete', () => {
    let category1Id: string;
    let category2Id: string;
    let category3Id: string;

    beforeAll(async () => {
      const cat1 = await request
        .post('/api/categories')
        .send({ name: 'Bulk Test Category 1' })
        .expect(201);
      category1Id = (cat1.body as CategoryResponse).id;

      const cat2 = await request
        .post('/api/categories')
        .send({ name: 'Bulk Test Category 2' })
        .expect(201);
      category2Id = (cat2.body as CategoryResponse).id;

      const cat3 = await request
        .post('/api/categories')
        .send({ name: 'Bulk Test Category 3' })
        .expect(201);
      category3Id = (cat3.body as CategoryResponse).id;
    });

    it('should delete multiple categories', async () => {
      await request
        .post('/api/categories/bulk-delete')
        .send({ ids: [category1Id, category2Id] })
        .expect(204);

      await request.get(`/api/categories/${category1Id}`).expect(404);
      await request.get(`/api/categories/${category2Id}`).expect(404);
      await request.get(`/api/categories/${category3Id}`).expect(200);
    });

    it('should return 404 when one or more categories not found', async () => {
      await request
        .post('/api/categories/bulk-delete')
        .send({ ids: ['550e8400-e29b-41d4-a716-446655440000', category3Id] })
        .expect(404);
    });

    it('should return 400 when ids array is empty', async () => {
      await request.post('/api/categories/bulk-delete').send({ ids: [] }).expect(400);
    });

    afterAll(async () => {
      try {
        await request.delete(`/api/categories/${category3Id}`);
      } catch (e) {
        // ignore
      }
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      await request.delete(`/api/categories/${createdCategoryId}`).expect(204);

      // Verify it's actually deleted
      await request.get(`/api/categories/${createdCategoryId}`).expect(404);
    });

    it('should return 404 when category not found', async () => {
      await request.delete('/api/categories/550e8400-e29b-41d4-a716-446655440000').expect(404);
    });
  });
});
