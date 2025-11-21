import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmountToGame1762971050000 implements MigrationInterface {
  name = 'AddAmountToGame1762971050000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" ADD "amount" integer NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "amount"`);
  }
}
