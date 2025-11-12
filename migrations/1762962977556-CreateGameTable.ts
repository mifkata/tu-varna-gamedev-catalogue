import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGameTable1762962977556 implements MigrationInterface {
  name = 'CreateGameTable1762962977556';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "games" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "minCpu" numeric(10,2) NOT NULL,
            "minMemory" integer NOT NULL,
            "multiplayer" boolean NOT NULL DEFAULT false,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "developer_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "UQ_c7d96d091489e8f7c8503994a99" UNIQUE ("developer_id", "name"),
            CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))
        `);
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_2ec2552bfa119d8743c844ef114" FOREIGN KEY ("developer_id") REFERENCES "game_developers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_70c843b0d593ff874aa4b5575d4" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_70c843b0d593ff874aa4b5575d4"`);
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_2ec2552bfa119d8743c844ef114"`);
    await queryRunner.query(`DROP TABLE "games"`);
  }
}
