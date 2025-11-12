import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGameDeveloperTable1762962370535 implements MigrationInterface {
  name = 'CreateGameDeveloperTable1762962370535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game_developers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53ba90e4bebd578eb238f24d17f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "game_developers"`);
  }
}
