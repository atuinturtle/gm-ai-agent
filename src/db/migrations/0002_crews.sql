CREATE TABLE "crew_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crews" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"crew_type_id" serial NOT NULL,
	"reputation" integer DEFAULT 0 NOT NULL,
	"hold" integer DEFAULT 0 NOT NULL,
	"tier" integer DEFAULT 0 NOT NULL,
	"heat" integer DEFAULT 0 NOT NULL,
	"wanted_level" integer DEFAULT 0 NOT NULL,
	"coins" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crews" ADD CONSTRAINT "crews_crew_type_id_crew_types_id_fk" FOREIGN KEY ("crew_type_id") REFERENCES "public"."crew_types"("id") ON DELETE no action ON UPDATE no action;