import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReleaseYearToGame1762971035780 implements MigrationInterface {
    name = 'AddReleaseYearToGame1762971035780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "release_year" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "release_year"`);
    }

}
