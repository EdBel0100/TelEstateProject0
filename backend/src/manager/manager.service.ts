import { Injectable } from '@nestjs/common';
import { Prisma } from '@database/generated';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ManagerService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createManagerDto: Prisma.ManagerCreateInput) {
    return this.databaseService.manager.create({ data: createManagerDto });
  }

  async findByPhone(phoneNumber: string): Promise<{ cognitoId: string }> {
    const manager = await this.databaseService.manager.findFirst({
      where: { phoneNumber },
      select: { cognitoId: true },
    });
  
    if (!manager) {
      throw new Error(`Manager with phone number ${phoneNumber} not found`);
    }
  
    return manager;
  }

  async update(id: number, updateManagerDto: Prisma.ManagerUpdateInput) {
    return this.databaseService.manager.update({
      where: { id },
      data: updateManagerDto,
    });
  }

}
