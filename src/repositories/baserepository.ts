// repositories/BaseRepository.ts
import { eq } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { injectable, unmanaged } from 'inversify';
import { IBaseRepository } from '../di/interfaces';

// A generic base repository that provides common operations
@injectable()
export abstract class BaseRepository<T, InsertT> implements IBaseRepository<T, InsertT> {
  constructor(
    @unmanaged() protected table: PgTable,
    @unmanaged() protected db: any,
    @unmanaged() protected idColumn: any
  ) {}

  // Find all records
  async findAll(): Promise<T[]> {
    return this.db.select().from(this.table);
  }

  // Find record by ID
  async findById(id: number): Promise<T | undefined> {
    const results = await this.db
      .select()
      .from(this.table)
      .where(eq(this.idColumn, id));
    
    return results.length > 0 ? results[0] : undefined;
  }

  // Insert a new record
  async create(data: InsertT): Promise<T> {
    const result = await this.db.insert(this.table).values(data).returning();
    return result[0];
  }

  // Update a record
  async update(id: number, data: Partial<InsertT>): Promise<T | undefined> {
    const result = await this.db
      .update(this.table)
      .set(data)
      .where(eq(this.idColumn, id))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }

  // Delete a record
  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.idColumn, id))
      .returning();
    
    return result.length > 0;
  }
}