import type { CategoryResponse } from '@backend/schemas/category.schema';
import type { GameDeveloperResponse } from '@backend/schemas/game-developer.schema';
import type { GameResponse } from '@backend/schemas/game.schema';
import { TestAgent, TestAppHelper } from '@backend/test/test-app.helper';

describe('/api/games', () => {
  let request: TestAgent;
  let testDeveloperId: string;
  let testCategoryId: string;
  let createdGameId: string;

  beforeAll(async () => {
    request = TestAppHelper.agent!;

    // Create test developer
    const developerResponse = await request
      .post('/api/game-developers')
      .send({ name: 'Test Developer for Games' })
      .expect(201);
    testDeveloperId = (developerResponse.body as GameDeveloperResponse).id;

    // Create test category
    const categoryResponse = await request
      .post('/api/categories')
      .send({ name: 'Test Category for Games' })
      .expect(201);
    testCategoryId = (categoryResponse.body as CategoryResponse).id;
  });

  describe('POST /api/games', () => {
    it('should create a new game', async () => {
      const response = await request
        .post('/api/games')
        .send({
          name: 'Test Game',
          developerId: testDeveloperId,
          categoryId: testCategoryId,
          minCpu: 2.5,
          minMemory: 4096,
          multiplayer: true,
          releaseYear: 2023,
          price: 29.99,
        })
        .expect(201);

      const body = response.body as GameResponse;
      expect(body).toMatchObject({
        id: expect.any(String),
        name: 'Test Game',
        developer: {
          id: testDeveloperId,
          name: 'Test Developer for Games',
        },
        category: {
          id: testCategoryId,
          name: 'Test Category for Games',
        },
        minCpu: 2.5,
        minMemory: 4096,
        multiplayer: true,
        releaseYear: 2023,
        price: 29.99,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      createdGameId = body.id;
    });

    it('should return 404 when developer does not exist', async () => {
      await request
        .post('/api/games')
        .send({
          name: 'Test Game',
          developerId: '550e8400-e29b-41d4-a716-446655440000',
          categoryId: testCategoryId,
          minCpu: 2.5,
          minMemory: 4096,
          multiplayer: false,
          releaseYear: 2023,
          price: 29.99,
        })
        .expect(404);
    });

    it('should return 404 when category does not exist', async () => {
      await request
        .post('/api/games')
        .send({
          name: 'Test Game',
          developerId: testDeveloperId,
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          minCpu: 2.5,
          minMemory: 4096,
          multiplayer: false,
          releaseYear: 2023,
          price: 29.99,
        })
        .expect(404);
    });

    it('should return 400 when required fields are missing', async () => {
      await request.post('/api/games').send({}).expect(400);
    });
  });

  describe('GET /api/games', () => {
    it('should return an array of games', async () => {
      const response = await request.get('/api/games').expect(200);

      const body = response.body as GameResponse[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        developer: {
          id: expect.any(String),
          name: expect.any(String),
        },
        category: {
          id: expect.any(String),
          name: expect.any(String),
        },
        minCpu: expect.any(Number),
        minMemory: expect.any(Number),
        multiplayer: expect.any(Boolean),
        releaseYear: expect.any(Number),
        price: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('GET /api/games/:id', () => {
    it('should return a game by id', async () => {
      const response = await request.get(`/api/games/${createdGameId}`).expect(200);

      const body = response.body as GameResponse;
      expect(body).toMatchObject({
        id: createdGameId,
        name: 'Test Game',
        developer: {
          id: testDeveloperId,
          name: 'Test Developer for Games',
        },
        category: {
          id: testCategoryId,
          name: 'Test Category for Games',
        },
        minCpu: 2.5,
        minMemory: 4096,
        multiplayer: true,
        releaseYear: 2023,
        price: 29.99,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when game not found', async () => {
      await request.get('/api/games/550e8400-e29b-41d4-a716-446655440000').expect(404);
    });
  });

  describe('PATCH /api/games/:id', () => {
    it('should update a game', async () => {
      const response = await request
        .patch(`/api/games/${createdGameId}`)
        .send({
          name: 'Updated Game',
          minCpu: 3.0,
          multiplayer: false,
        })
        .expect(200);

      const body = response.body as GameResponse;
      expect(body).toMatchObject({
        id: createdGameId,
        name: 'Updated Game',
        minCpu: 3.0,
        multiplayer: false,
        minMemory: 4096,
        releaseYear: 2023,
      });
    });

    it('should return 404 when game not found', async () => {
      await request
        .patch('/api/games/550e8400-e29b-41d4-a716-446655440000')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('POST /api/games/bulk-delete', () => {
    let game1Id: string;
    let game2Id: string;
    let game3Id: string;

    beforeAll(async () => {
      const game1 = await request
        .post('/api/games')
        .send({
          name: 'Bulk Test Game 1',
          developerId: testDeveloperId,
          categoryId: testCategoryId,
          minCpu: 2.0,
          minMemory: 2048,
          multiplayer: false,
          releaseYear: 2020,
          price: 19.99,
        })
        .expect(201);
      game1Id = (game1.body as GameResponse).id;

      const game2 = await request
        .post('/api/games')
        .send({
          name: 'Bulk Test Game 2',
          developerId: testDeveloperId,
          categoryId: testCategoryId,
          minCpu: 2.0,
          minMemory: 2048,
          multiplayer: false,
          releaseYear: 2021,
          price: 19.99,
        })
        .expect(201);
      game2Id = (game2.body as GameResponse).id;

      const game3 = await request
        .post('/api/games')
        .send({
          name: 'Bulk Test Game 3',
          developerId: testDeveloperId,
          categoryId: testCategoryId,
          minCpu: 2.0,
          minMemory: 2048,
          multiplayer: false,
          releaseYear: 2022,
          price: 19.99,
        })
        .expect(201);
      game3Id = (game3.body as GameResponse).id;
    });

    it('should delete multiple games', async () => {
      await request
        .post('/api/games/bulk-delete')
        .send({ ids: [game1Id, game2Id] })
        .expect(204);

      await request.get(`/api/games/${game1Id}`).expect(404);
      await request.get(`/api/games/${game2Id}`).expect(404);
      await request.get(`/api/games/${game3Id}`).expect(200);
    });

    it('should return 404 when one or more games not found', async () => {
      await request
        .post('/api/games/bulk-delete')
        .send({ ids: ['550e8400-e29b-41d4-a716-446655440000', game3Id] })
        .expect(404);
    });

    it('should return 400 when ids array is empty', async () => {
      await request.post('/api/games/bulk-delete').send({ ids: [] }).expect(400);
    });

    afterAll(async () => {
      try {
        await request.delete(`/api/games/${game3Id}`);
      } catch (e) {
        // ignore
      }
    });
  });

  describe('DELETE /api/games/:id', () => {
    it('should delete a game', async () => {
      await request.delete(`/api/games/${createdGameId}`).expect(204);

      // Verify it's actually deleted
      await request.get(`/api/games/${createdGameId}`).expect(404);
    });

    it('should return 404 when game not found', async () => {
      await request.delete('/api/games/550e8400-e29b-41d4-a716-446655440000').expect(404);
    });
  });
});
