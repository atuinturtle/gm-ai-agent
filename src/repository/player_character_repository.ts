import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { player_characters, character_actions, character_abilities, actions, abilities } from '../db/schema';
import type { PlayerCharacter, NewPlayerCharacter } from '../db/schema';

export class PlayerCharacterRepository {
  async findAll(): Promise<PlayerCharacter[]> {
    return await db.select().from(player_characters);
  }

  async findById(id: number): Promise<PlayerCharacter | undefined> {
    const results = await db
      .select()
      .from(player_characters)
      .where(eq(player_characters.id, id))
      .limit(1);
    
    return results[0];
  }

  async create(character: NewPlayerCharacter): Promise<PlayerCharacter> {
    const [inserted] = await db
      .insert(player_characters)
      .values(character)
      .returning();
    
    if (!inserted) throw new Error('Failed to create player character');
    return inserted;
  }

  async update(id: number, character: Partial<NewPlayerCharacter>): Promise<PlayerCharacter> {
    const [updated] = await db
      .update(player_characters)
      .set(character)
      .where(eq(player_characters.id, id))
      .returning();
    
    if (!updated) throw new Error('Failed to update player character');
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db
      .delete(player_characters)
      .where(eq(player_characters.id, id))
      .returning({ id: player_characters.id });
    
    return deleted.length > 0;
  }

  async getCharacterActions(characterId: number) {
    return await db
      .select({
        id: character_actions.id,
        rating: character_actions.rating,
        action: {
          id: actions.id,
          name: actions.name,
          description: actions.description
        }
      })
      .from(character_actions)
      .innerJoin(actions, eq(character_actions.action_id, actions.id))
      .where(eq(character_actions.character_id, characterId));
  }

  async getCharacterAbilities(characterId: number) {
    return await db
      .select({
        id: character_abilities.id,
        acquired_at: character_abilities.acquired_at,
        ability: {
          id: abilities.id,
          name: abilities.name,
          description: abilities.description
        }
      })
      .from(character_abilities)
      .innerJoin(abilities, eq(character_abilities.ability_id, abilities.id))
      .where(eq(character_abilities.character_id, characterId));
  }
}
