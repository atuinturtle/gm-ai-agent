CREATE TABLE "hunting_grounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"crew_type_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hunting_grounds" ADD CONSTRAINT "hunting_grounds_crew_type_id_crew_types_id_fk" FOREIGN KEY ("crew_type_id") REFERENCES "public"."crew_types"("id") ON DELETE no action ON UPDATE no action;