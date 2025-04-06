CREATE TABLE "character_abilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" serial NOT NULL,
	"ability_id" serial NOT NULL,
	"acquired_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" serial NOT NULL,
	"action_id" serial NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playbooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "abilities" ADD COLUMN "playbook_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "player_characters" ADD COLUMN "alias" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "character_abilities" ADD CONSTRAINT "character_abilities_character_id_player_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."player_characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_abilities" ADD CONSTRAINT "character_abilities_ability_id_abilities_id_fk" FOREIGN KEY ("ability_id") REFERENCES "public"."abilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_actions" ADD CONSTRAINT "character_actions_character_id_player_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."player_characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_actions" ADD CONSTRAINT "character_actions_action_id_actions_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."actions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_playbook_id_playbooks_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbooks"("id") ON DELETE no action ON UPDATE no action;