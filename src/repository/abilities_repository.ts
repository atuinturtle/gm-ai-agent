import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { abilities, playbooks } from '../db/schema';
import type { Ability } from '../db/schema';

export class AbilitiesRepository {
  async findAll(): Promise<Ability[]> {
    return await db.select().from(abilities);
  }

  async findById(id: number): Promise<Ability | undefined> {
    const results = await db
      .select()
      .from(abilities)
      .where(eq(abilities.id, id))
      .limit(1);
    
    return results[0];
  }

  async findByName(name: string): Promise<Ability | undefined> {
    const results = await db
      .select()
      .from(abilities)
      .where(eq(abilities.name, name))
      .limit(1);
    
    return results[0];
  }

  async findByPlaybookId(playbookId: number): Promise<Ability[]> {
    return await db
      .select()
      .from(abilities)
      .where(eq(abilities.playbook_id, playbookId));
  }

  async getAbilitiesWithPlaybooks(): Promise<(Ability & { playbook: { id: number; name: string; description: string } })[]> {
    return await db
      .select({
        id: abilities.id,
        name: abilities.name,
        description: abilities.description,
        playbook_id: abilities.playbook_id,
        playbook: {
          id: playbooks.id,
          name: playbooks.name,
          description: playbooks.description
        }
      })
      .from(abilities)
      .innerJoin(playbooks, eq(abilities.playbook_id, playbooks.id));
  }
}
