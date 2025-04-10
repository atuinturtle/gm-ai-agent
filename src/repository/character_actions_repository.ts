import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { character_actions, actions } from '../db/schema';

export class CharacterActionsRepository {
  async findByCharacterId(characterId: number) {
    return await db
      .select()
      .from(character_actions)
      .where(eq(character_actions.character_id, characterId));
  }

  async findByActionId(actionId: number) {
    return await db
      .select()
      .from(character_actions)
      .where(eq(character_actions.action_id, actionId));
  }

  async findByCharacterAndActionId(characterId: number, actionId: number) {
    const results = await db
      .select()
      .from(character_actions)
      .where(
        eq(character_actions.character_id, characterId) &&
        eq(character_actions.action_id, actionId)
      )
      .limit(1);
    
    return results[0];
  }

  async create(characterId: number, actionId: number, rating: number = 0) {
    const [inserted] = await db
      .insert(character_actions)
      .values({
        character_id: characterId,
        action_id: actionId,
        rating
      })
      .returning();
    
    if (!inserted) throw new Error('Failed to create character action');
    return inserted;
  }

  async updateRating(characterId: number, actionId: number, rating: number) {
    const [updated] = await db
      .update(character_actions)
      .set({ rating })
      .where(
        eq(character_actions.character_id, characterId) &&
        eq(character_actions.action_id, actionId)
      )
      .returning();
    
    if (!updated) throw new Error('Failed to update character action rating');
    return updated;
  }

  async delete(characterId: number, actionId: number) {
    const deleted = await db
      .delete(character_actions)
      .where(
        eq(character_actions.character_id, characterId) &&
        eq(character_actions.action_id, actionId)
      )
      .returning({ id: character_actions.id });
    
    return deleted.length > 0;
  }
}
