import { CrewRepository } from "../repository/crew_repository";
import { CrewTypesRepository } from "../repository/crew_types_repository";
import type { Crew, CrewType, HuntingGround } from "../db/schema";
import { HuntingGroundsRepository } from "../repository/hunting_grounds_repository";

export class CrewService {
  private crewRepository: CrewRepository;
  private crewTypesRepository: CrewTypesRepository;
  private huntingGroundsRepository: HuntingGroundsRepository;
  constructor() {
    this.crewRepository = new CrewRepository();
    this.crewTypesRepository = new CrewTypesRepository();
    this.huntingGroundsRepository = new HuntingGroundsRepository();
  }

  async getAllCrews(): Promise<Crew[]> {
    return await this.crewRepository.findAll();
  }

  async getCrewById(id: number): Promise<Crew | undefined> {
    return await this.crewRepository.findById(id);
  }

  async getCrewByName(name: string): Promise<Crew | undefined> {
    return await this.crewRepository.findByName(name);
  }

  async getCrewsByType(crewTypeId: number): Promise<Crew[]> {
    return await this.crewRepository.findByCrewTypeId(crewTypeId);
  }

  async getCrewsWithDetails(): Promise<(Crew & { crew_type: CrewType })[]> {
    return await this.crewRepository.getCrewsWithCrewTypes();
  }

  async getCrewWithDetails(id: number): Promise<({crew: Crew, hunting_ground: HuntingGround[]}) | undefined> {
    const crew = await this.crewRepository.findById(id);
    if (!crew) return undefined;

    const hunting_ground = await this.huntingGroundsRepository.findByCrewTypeId(crew.crew_type_id);
    return {
      crew,
      hunting_ground
    };  
  }

  async createCrew(crew: Omit<Crew, 'id' | 'created_at'>): Promise<Crew> {
    return await this.crewRepository.create(crew);
  }

  async updateCrew(id: number, crew: Partial<Omit<Crew, 'id' | 'created_at'>>): Promise<Crew | undefined> {
    return await this.crewRepository.update(id, crew);
  }

  async deleteCrew(id: number): Promise<boolean> {
    return await this.crewRepository.delete(id);
  }

  async getAllCrewTypes(): Promise<CrewType[]> {
    return await this.crewTypesRepository.findAll();
  }

  async getCrewTypeById(id: number): Promise<CrewType | undefined> {
    return await this.crewTypesRepository.findById(id);
  }

  async getCrewTypeByName(name: string): Promise<CrewType | undefined> {
    return await this.crewTypesRepository.findByName(name);
  }

  async createCrewType(crewType: Omit<CrewType, 'id'>): Promise<CrewType> {
    return await this.crewTypesRepository.create(crewType);
  }

  async updateCrewType(id: number, crewType: Partial<Omit<CrewType, 'id'>>): Promise<CrewType | undefined> {
    return await this.crewTypesRepository.update(id, crewType);
  }

  async deleteCrewType(id: number): Promise<boolean> {
    return await this.crewTypesRepository.delete(id);
  }
}
