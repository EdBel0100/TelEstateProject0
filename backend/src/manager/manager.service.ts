import { Injectable } from '@nestjs/common';
import { Prisma } from '@database/generated';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ManagerService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createManagerDto: Prisma.ManagerCreateInput) {
    return this.databaseService.manager.create({ data: createManagerDto });
  }

  async findByPhone(phoneNumber: string) {
    return this.databaseService.manager.findFirst({
      where: {
        phoneNumber,
      },
      select: {
        cognitoId: true,
      },
    });
  }

  async findAll() {
    return this.databaseService.manager.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.manager.findFirst({ where: { id } });
  }

  async update(id: number, updateManagerDto: Prisma.ManagerUpdateInput) {
    return this.databaseService.manager.update({
      where: { id },
      data: updateManagerDto,
    });
  }

}
