import { db } from '../db/db';
import { crews, crew_types } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Crew, CrewType } from '../db/schema';

export class CrewRepository {
  async findAll(): Promise<Crew[]> {
    return await db.select().from(crews);
  }

  async findById(id: number): Promise<Crew | undefined> {
    const results = await db
      .select()
      .from(crews)
      .where(eq(crews.id, id))
      .limit(1);
    
    return results[0];
  }

  async findByName(name: string): Promise<Crew | undefined> {
    const results = await db
      .select()
      .from(crews)
      .where(eq(crews.name, name))
      .limit(1);
    
    return results[0];
  }

  async findByCrewTypeId(crewTypeId: number): Promise<Crew[]> {
    return await db
      .select()
      .from(crews)
      .where(eq(crews.crew_type_id, crewTypeId));
  }

  async getCrewsWithCrewTypes(): Promise<(Crew & { crew_type: CrewType })[]> {
    return await db
      .select({
        id: crews.id,
        name: crews.name,
        crew_type_id: crews.crew_type_id,
        initial_reputation: crews.initial_reputation,
        reputation: crews.reputation,
        hold: crews.hold,
        tier: crews.tier,
        heat: crews.heat,
        wanted_level: crews.wanted_level,
        coins: crews.coins,
        created_at: crews.created_at,
        crew_type: crew_types
      })
      .from(crews)
      .innerJoin(crew_types, eq(crews.crew_type_id, crew_types.id));
  }

  async create(crew: Omit<Crew, 'id' | 'created_at'>): Promise<Crew> {
    const result = await db.insert(crews).values(crew).returning();
    if (!result[0]) {
      throw new Error("Failed to create crew");
    }
    return result[0];
  }

  async update(id: number, crew: Partial<Omit<Crew, 'id' | 'created_at'>>): Promise<Crew | undefined> {
    const result = await db
      .update(crews)
      .set(crew)
      .where(eq(crews.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(crews)
      .where(eq(crews.id, id))
      .returning({ id: crews.id });
    
    return result.length > 0;
  }
}
