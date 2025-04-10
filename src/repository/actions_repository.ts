import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { actions, attributes } from '../db/schema';
import type { Action } from '../db/schema';

export class ActionsRepository {
  async findAll(): Promise<Action[]> {
    return await db.select().from(actions);
  }

  async findById(id: number): Promise<Action | undefined> {
    const results = await db
      .select()
      .from(actions)
      .where(eq(actions.id, id))
      .limit(1);
    
    return results[0];
  }

  async findByName(name: string): Promise<Action | undefined> {
    const results = await db
      .select()
      .from(actions)
      .where(eq(actions.name, name))
      .limit(1);
    
    return results[0];
  }

  async findByAttributeId(attributeId: number): Promise<Action[]> {
    return await db
      .select()
      .from(actions)
      .where(eq(actions.attribute_id, attributeId));
  }

  async getActionsWithAttributes(): Promise<(Action & { attribute: { id: number; name: string; description: string } })[]> {
    return await db
      .select({
        id: actions.id,
        name: actions.name,
        description: actions.description,
        attribute_id: actions.attribute_id,
        attribute: {
          id: attributes.id,
          name: attributes.name,
          description: attributes.description
        }
      })
      .from(actions)
      .innerJoin(attributes, eq(actions.attribute_id, attributes.id));
  }
}
