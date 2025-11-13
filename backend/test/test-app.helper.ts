import supertest from 'supertest';

import { AppRunner } from '@backend/lib/app.runner';

export type TestAgent = ReturnType<typeof supertest>;

export class TestAppHelper {
  private static _agent: TestAgent | null;
  private static app: AppRunner | null = null;

  private static set agent(value: TestAgent | null) {
    this._agent = value;
  }

  public static get agent() {
    return this._agent;
  }

  public static async tearUp(): Promise<TestAgent> {
    if (!this.agent) {
      this.app = await AppRunner.run();
      await this.app.backend.app.getHttpAdapter().getInstance().ready();
      this.agent = supertest(this.app.backend.app.getHttpServer());
    }

    return this.agent;
  }

  public static async tearDown(): Promise<void> {
    await this.app?.shutdown();

    this.agent = null;
    this.app = null;
  }
}
