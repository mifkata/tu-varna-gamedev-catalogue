import { TestAgent, TestAppHelper } from '@backend/test/test-app.helper';

describe('GET /api/health', () => {
  let request: TestAgent;

  beforeAll(() => {
    request = TestAppHelper.agent!;
  });

  it('should return health status', async () => {
    const response = await request.get('/api/health').expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
    });
  });
});
