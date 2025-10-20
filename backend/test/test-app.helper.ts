import { NestFastifyApplication } from '@nestjs/platform-fastify';
import supertest from 'supertest';

import { AppBootstrap } from '@backend/app.bootstrap';

export type TestAgent = ReturnType<typeof supertest>;

export class TestAppHelper {
  private static _agent: TestAgent | null;
  private static app: NestFastifyApplication | null = null;

  private static set agent(value: TestAgent | null) {
    this._agent = value;
  }

  public static get agent() {
    return this._agent;
  }

  public static async tearUp(): Promise<TestAgent> {
    if (!this.agent) {
      this.app = (await AppBootstrap.bootstrap()).app;
      this.agent = supertest(this.app.getHttpServer());
    }

    return this.agent;
  }

  public static async tearDown(): Promise<void> {
    await this.app?.close();

    this.agent = null;
    this.app = null;
  }
}
