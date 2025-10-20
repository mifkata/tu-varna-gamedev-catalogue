import { TestAppHelper } from './test-app.helper';

beforeAll(async () => {
  await TestAppHelper.tearUp();
});

afterAll(async () => {
  await TestAppHelper.tearDown();
});
