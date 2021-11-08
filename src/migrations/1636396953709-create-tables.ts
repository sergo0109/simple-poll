import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1636396953709 implements MigrationInterface {
    name = 'createTables1636396953709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_tokens_type_enum" AS ENUM('VERIFY_ACCOUNT', 'FORGOT_PASSWORD')`);
        await queryRunner.query(`CREATE TABLE "users_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_email" character varying NOT NULL, "token" character varying NOT NULL, "type" "public"."users_tokens_type_enum" NOT NULL, CONSTRAINT "UQ_16796eb52a059007e7e4f5fa72e" UNIQUE ("token"), CONSTRAINT "PK_9f236389174a6ccbd746f53dca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'CUSTOMER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "full_name" character varying NOT NULL, "email" character varying NOT NULL, "user_name" character varying NOT NULL, "avatar" character varying, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_36a3fc9cb216b550beee2dce260" UNIQUE ("avatar"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vote_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "poll_id" uuid NOT NULL, CONSTRAINT "UQ_dda9815e895f54fbf2e576a5e5f" UNIQUE ("poll_id", "text"), CONSTRAINT "PK_b42c10f7972e40ae469e181739b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "polls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_ae8a5a33ca207f8c411e6c431d0" UNIQUE ("user_id", "title", "description"), CONSTRAINT "PK_b9bbb8fc7b142553c518ddffbb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vote_options_users" ("vote_options_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_97740b9d39250e4c04cc51d8a01" PRIMARY KEY ("vote_options_id", "users_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02a80324e396073805626c9498" ON "vote_options_users" ("vote_options_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_44d6521bdfa1a2449a9623730f" ON "vote_options_users" ("users_id") `);
        await queryRunner.query(`ALTER TABLE "vote_options" ADD CONSTRAINT "FK_7b7e4379ebd948f51ec5e76faf1" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "polls" ADD CONSTRAINT "FK_7248107fd034c263fa56bbc5c2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "vote_options_users" ADD CONSTRAINT "FK_02a80324e396073805626c9498e" FOREIGN KEY ("vote_options_id") REFERENCES "vote_options"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "vote_options_users" ADD CONSTRAINT "FK_44d6521bdfa1a2449a9623730f1" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote_options_users" DROP CONSTRAINT "FK_44d6521bdfa1a2449a9623730f1"`);
        await queryRunner.query(`ALTER TABLE "vote_options_users" DROP CONSTRAINT "FK_02a80324e396073805626c9498e"`);
        await queryRunner.query(`ALTER TABLE "polls" DROP CONSTRAINT "FK_7248107fd034c263fa56bbc5c2b"`);
        await queryRunner.query(`ALTER TABLE "vote_options" DROP CONSTRAINT "FK_7b7e4379ebd948f51ec5e76faf1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44d6521bdfa1a2449a9623730f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02a80324e396073805626c9498"`);
        await queryRunner.query(`DROP TABLE "vote_options_users"`);
        await queryRunner.query(`DROP TABLE "polls"`);
        await queryRunner.query(`DROP TABLE "vote_options"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "users_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."users_tokens_type_enum"`);
    }

}
