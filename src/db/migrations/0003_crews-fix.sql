ALTER TABLE "crews" RENAME COLUMN "description" TO "initial_reputation";--> statement-breakpoint
ALTER TABLE "player_characters" ADD COLUMN "crew_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "player_characters" ADD CONSTRAINT "player_characters_crew_id_crews_id_fk" FOREIGN KEY ("crew_id") REFERENCES "public"."crews"("id") ON DELETE no action ON UPDATE no action;