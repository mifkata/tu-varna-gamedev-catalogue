import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriceToGame1762971040000 implements MigrationInterface {
  name = 'AddPriceToGame1762971040000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" ADD "price" numeric(10,2) NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "price"`);
  }
}
