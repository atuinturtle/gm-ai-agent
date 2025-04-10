import { CrewRepository } from "../repository/crew_repository";
import { CrewTypesRepository } from "../repository/crew_types_repository";
import type { Crew, CrewType } from "../db/schema";

export class CrewService {
  private crewRepository: CrewRepository;
  private crewTypesRepository: CrewTypesRepository;

  constructor() {
    this.crewRepository = new CrewRepository();
    this.crewTypesRepository = new CrewTypesRepository();
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

  async getCrewWithDetails(id: number): Promise<(Crew & { crew_type: CrewType }) | undefined> {
    const crews = await this.crewRepository.getCrewsWithCrewTypes();
    return crews.find(crew => crew.id === id);
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
