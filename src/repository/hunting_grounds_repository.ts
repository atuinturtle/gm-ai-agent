import { db } from '../db/db';
import { hunting_grounds } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { HuntingGround } from '../db/schema';

export class HuntingGroundsRepository {
  async findAll(): Promise<HuntingGround[]> {
    return await db.select().from(hunting_grounds);
  }

  async findById(id: number): Promise<HuntingGround | undefined> {
    const results = await db.select().from(hunting_grounds).where(eq(hunting_grounds.id, id));
    return results[0];
  }

  async findByCrewTypeId(crewTypeId: number): Promise<HuntingGround[]> {
    return await db.select().from(hunting_grounds).where(eq(hunting_grounds.crew_type_id, crewTypeId));
  }

  async create(huntingGround: Omit<HuntingGround, 'id' | 'created_at'>): Promise<HuntingGround> {
    const results = await db.insert(hunting_grounds).values(huntingGround).returning();
    if (results[0] === undefined) {
      throw new Error('Failed to create hunting ground');
    }
    return results[0];
  }

  async update(id: number, huntingGround: Partial<Omit<HuntingGround, 'id' | 'created_at'>>): Promise<HuntingGround | undefined> {
    const results = await db.update(hunting_grounds)
      .set(huntingGround)
      .where(eq(hunting_grounds.id, id))
      .returning();
    return results[0];
  }

  async delete(id: number): Promise<HuntingGround | undefined> {
    const results = await db.delete(hunting_grounds)
      .where(eq(hunting_grounds.id, id))
      .returning();
    return results[0];
  }
}
