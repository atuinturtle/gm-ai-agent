import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { character_abilities, abilities } from '../db/schema';

export class CharacterAbilitiesRepository {
  async findAll() {
    return await db.select().from(character_abilities);
  }

  async findByCharacterId(characterId: number) {
    return await db
      .select()
      .from(character_abilities)
      .where(eq(character_abilities.character_id, characterId));
  }

  async findByAbilityId(abilityId: number) {
    return await db
      .select()
      .from(character_abilities)
      .where(eq(character_abilities.ability_id, abilityId));
  }

  async findByCharacterAndAbility(characterId: number, abilityId: number) {
    const results = await db
      .select()
      .from(character_abilities)
      .where(
        eq(character_abilities.character_id, characterId) &&
        eq(character_abilities.ability_id, abilityId)
      )
      .limit(1);
    
    return results[0];
  }

  async create(characterId: number, abilityId: number) {
    const [inserted] = await db
      .insert(character_abilities)
      .values({
        character_id: characterId,
        ability_id: abilityId
      })
      .returning();
    
    if (!inserted) throw new Error('Failed to create character ability');
    return inserted;
  }

  async delete(characterId: number, abilityId: number) {
    const deleted = await db
      .delete(character_abilities)
      .where(
        eq(character_abilities.character_id, characterId) &&
        eq(character_abilities.ability_id, abilityId)
      )
      .returning({ id: character_abilities.id });
    
    return deleted.length > 0;
  }

  async getCharacterAbilitiesWithDetails(characterId: number) {
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
