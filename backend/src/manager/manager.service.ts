import { Injectable } from '@nestjs/common';
import { Prisma } from '@database/generated';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ManagerService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createManagerDto: Prisma.LandlordCreateInput) {
    return this.databaseService.landlord.create({ data: createManagerDto });
  }

  async findByPhone(phoneNumber: string) {
    return this.databaseService.landlord.findFirst({
      where: {
        phoneNumber,
      },
      select: {
        cognitoId: true,
      },
    });
  }

  async findAll() {
    return this.databaseService.landlord.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.landlord.findFirst({ where: { id } });
  }

  async update(id: number, updateManagerDto: Prisma.LandlordUpdateInput) {
    return this.databaseService.landlord.update({
      where: { id },
      data: updateManagerDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.landlord.delete({
      where: { id },
    });
  }
}
