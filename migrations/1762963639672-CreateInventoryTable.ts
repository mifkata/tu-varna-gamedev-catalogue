import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryTable1762963639672 implements MigrationInterface {
  name = 'CreateInventoryTable1762963639672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "inventory" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "units" integer NOT NULL,
            "price" numeric(10,2) NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "game_id" uuid NOT NULL,
            CONSTRAINT "REL_bb05fcfac64594f453b3ff8cf6" UNIQUE ("game_id"),
            CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))
        `);
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_bb05fcfac64594f453b3ff8cf64" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_bb05fcfac64594f453b3ff8cf64"`,
    );
    await queryRunner.query(`DROP TABLE "inventory"`);
  }
}
