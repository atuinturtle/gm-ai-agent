import { db } from "../db/db";
import { crew_types } from "../db/schema";
import { eq } from "drizzle-orm";
import type { CrewType } from "../db/schema";

export class CrewTypesRepository {
  async findAll(): Promise<CrewType[]> {
    return await db.select().from(crew_types);
  }

  async findById(id: number): Promise<CrewType | undefined> {
    const results = await db
      .select()
      .from(crew_types)
      .where(eq(crew_types.id, id))
      .limit(1);
    
    return results[0];
  }

  async findByName(name: string): Promise<CrewType | undefined> {
    const results = await db
      .select()
      .from(crew_types)
      .where(eq(crew_types.name, name))
      .limit(1);
    
    return results[0];
  }

  async create(crewType: Omit<CrewType, 'id'>): Promise<CrewType> {
    const result = await db.insert(crew_types).values(crewType).returning();
    if (!result[0]) {
      throw new Error("Failed to create crew type");
    }
    return result[0];
  }

  async update(id: number, crewType: Partial<Omit<CrewType, 'id'>>): Promise<CrewType | undefined> {
    const result = await db
      .update(crew_types)
      .set(crewType)
      .where(eq(crew_types.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(crew_types)
      .where(eq(crew_types.id, id))
      .returning({ id: crew_types.id });
    
    return result.length > 0;
  }
}
