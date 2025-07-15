import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@database/generated';

@Injectable()
export class BuildingService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: Prisma.BuildingCreateInput) {
    return this.databaseService.building.create({ data });
  }

  findAll() {
    return this.databaseService.building.findMany();
  }

  findOne(where: Prisma.BuildingWhereInput) {
    return this.databaseService.building.findFirst({ where });
  }

  getBuildingByName(where: Prisma.BuildingWhereInput) {
    return this.databaseService.building.findFirst({ where })
  }

  update(id: number, data: Prisma.BuildingUpdateInput) {
    return this.databaseService.building.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.databaseService.building.delete({ where: { id } });
  }
}
