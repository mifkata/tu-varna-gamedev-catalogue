import type {
  GameDeveloperResponse,
  GameDeveloperListItem,
} from '@backend/schemas/game-developer.schema';
import { TestAgent, TestAppHelper } from '@backend/test/test-app.helper';

describe('/api/game-developers', () => {
  let request: TestAgent;
  let createdDeveloperId: string;

  beforeAll(() => {
    request = TestAppHelper.agent!;
  });

  describe('POST /api/game-developers', () => {
    it('should create a new game developer', async () => {
      const response = await request
        .post('/api/game-developers')
        .send({ name: 'Test Developer' })
        .expect(201);

      const body = response.body as GameDeveloperResponse;
      expect(body).toMatchObject({
        id: expect.any(String),
        name: 'Test Developer',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      createdDeveloperId = body.id;
    });

    it('should return 400 when name is missing', async () => {
      await request.post('/api/game-developers').send({}).expect(400);
    });
  });

  describe('GET /api/game-developers', () => {
    it('should return an array of game developers', async () => {
      const response = await request.get('/api/game-developers').expect(200);

      const body = response.body as GameDeveloperListItem[];
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

  describe('GET /api/game-developers/:id', () => {
    it('should return a game developer by id', async () => {
      const response = await request.get(`/api/game-developers/${createdDeveloperId}`).expect(200);

      const body = response.body as GameDeveloperResponse;
      expect(body).toMatchObject({
        id: createdDeveloperId,
        name: 'Test Developer',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when game developer not found', async () => {
      await request.get('/api/game-developers/550e8400-e29b-41d4-a716-446655440000').expect(404);
    });
  });

  describe('PATCH /api/game-developers/:id', () => {
    it('should update a game developer', async () => {
      const response = await request
        .patch(`/api/game-developers/${createdDeveloperId}`)
        .send({ name: 'Updated Developer' })
        .expect(200);

      const body = response.body as GameDeveloperResponse;
      expect(body).toMatchObject({
        id: createdDeveloperId,
        name: 'Updated Developer',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when game developer not found', async () => {
      await request
        .patch('/api/game-developers/550e8400-e29b-41d4-a716-446655440000')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('POST /api/game-developers/bulk-delete', () => {
    let developer1Id: string;
    let developer2Id: string;
    let developer3Id: string;

    beforeAll(async () => {
      const dev1 = await request
        .post('/api/game-developers')
        .send({ name: 'Bulk Test Developer 1' })
        .expect(201);
      developer1Id = (dev1.body as GameDeveloperResponse).id;

      const dev2 = await request
        .post('/api/game-developers')
        .send({ name: 'Bulk Test Developer 2' })
        .expect(201);
      developer2Id = (dev2.body as GameDeveloperResponse).id;

      const dev3 = await request
        .post('/api/game-developers')
        .send({ name: 'Bulk Test Developer 3' })
        .expect(201);
      developer3Id = (dev3.body as GameDeveloperResponse).id;
    });

    it('should delete multiple game developers', async () => {
      await request
        .post('/api/game-developers/bulk-delete')
        .send({ ids: [developer1Id, developer2Id] })
        .expect(204);

      await request.get(`/api/game-developers/${developer1Id}`).expect(404);
      await request.get(`/api/game-developers/${developer2Id}`).expect(404);
      await request.get(`/api/game-developers/${developer3Id}`).expect(200);
    });

    it('should return 404 when one or more game developers not found', async () => {
      await request
        .post('/api/game-developers/bulk-delete')
        .send({ ids: ['550e8400-e29b-41d4-a716-446655440000', developer3Id] })
        .expect(404);
    });

    it('should return 400 when ids array is empty', async () => {
      await request.post('/api/game-developers/bulk-delete').send({ ids: [] }).expect(400);
    });

    afterAll(async () => {
      try {
        await request.delete(`/api/game-developers/${developer3Id}`);
      } catch (e) {
        // ignore
      }
    });
  });

  describe('DELETE /api/game-developers/:id', () => {
    it('should delete a game developer', async () => {
      await request.delete(`/api/game-developers/${createdDeveloperId}`).expect(204);

      // Verify it's actually deleted
      await request.get(`/api/game-developers/${createdDeveloperId}`).expect(404);
    });

    it('should return 404 when game developer not found', async () => {
      await request.delete('/api/game-developers/550e8400-e29b-41d4-a716-446655440000').expect(404);
    });
  });
});
