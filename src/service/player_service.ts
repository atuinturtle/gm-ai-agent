import { PlayerCharacterRepository } from '../repository/player_character_repository';
import { CharacterActionsRepository } from '../repository/character_actions_repository';
import { CharacterAbilitiesRepository } from '../repository/character_abilities_repository';
import { ActionsRepository } from '../repository/actions_repository';
import { AbilitiesRepository } from '../repository/abilities_repository';
import type { NewPlayerCharacter, PlayerCharacter } from '../db/schema';

export class PlayerService {
  private playerCharacterRepository: PlayerCharacterRepository;
  private characterActionsRepository: CharacterActionsRepository;
  private characterAbilitiesRepository: CharacterAbilitiesRepository;
  private actionsRepository: ActionsRepository;
  private abilitiesRepository: AbilitiesRepository;

  constructor() {
    this.playerCharacterRepository = new PlayerCharacterRepository();
    this.characterActionsRepository = new CharacterActionsRepository();
    this.characterAbilitiesRepository = new CharacterAbilitiesRepository();
    this.actionsRepository = new ActionsRepository();
    this.abilitiesRepository = new AbilitiesRepository();
  }

  async getAllCharacters(): Promise<PlayerCharacter[]> {
    return await this.playerCharacterRepository.findAll();
  }

  async getCharacterById(id: number): Promise<PlayerCharacter | undefined> {
    return await this.playerCharacterRepository.findById(id);
  }

  async createCharacter(character: NewPlayerCharacter): Promise<PlayerCharacter> {
    return await this.playerCharacterRepository.create(character);
  }

  async updateCharacter(id: number, character: Partial<NewPlayerCharacter>): Promise<PlayerCharacter> {
    return await this.playerCharacterRepository.update(id, character);
  }

  async deleteCharacter(id: number): Promise<boolean> {
    return await this.playerCharacterRepository.delete(id);
  }

  async getCharacterActions(characterId: number) {
    return await this.playerCharacterRepository.getCharacterActions(characterId);
  }

  async getCharacterAbilities(characterId: number) {
    return await this.playerCharacterRepository.getCharacterAbilities(characterId);
  }

  async addActionToCharacter(characterId: number, actionId: number, rating: number = 0) {
    return await this.characterActionsRepository.create(characterId, actionId, rating);
  }

  async updateCharacterActionRating(characterId: number, actionId: number, rating: number) {
    return await this.characterActionsRepository.updateRating(characterId, actionId, rating);
  }

  async removeActionFromCharacter(characterId: number, actionId: number) {
    return await this.characterActionsRepository.delete(characterId, actionId);
  }

  async addAbilityToCharacter(characterId: number, abilityId: number) {
    return await this.characterAbilitiesRepository.create(characterId, abilityId);
  }

  async removeAbilityFromCharacter(characterId: number, abilityId: number) {
    return await this.characterAbilitiesRepository.delete(characterId, abilityId);
  }

  async getCharacterWithDetails(characterId: number) {
    const character = await this.playerCharacterRepository.findById(characterId);
    if (!character) return undefined;

    const actions = await this.playerCharacterRepository.getCharacterActions(characterId);
    const abilities = await this.playerCharacterRepository.getCharacterAbilities(characterId);

    return {
      ...character,
      actions,
      abilities
    };
  }

  async getAllActions() {
    return await this.actionsRepository.findAll();
  }

  async getActionsWithAttributes() {
    return await this.actionsRepository.getActionsWithAttributes();
  }

  async getAllAbilities() {
    return await this.abilitiesRepository.findAll();
  }

  async getAbilitiesWithPlaybooks() {
    return await this.abilitiesRepository.getAbilitiesWithPlaybooks();
  }
}
