// src/building/building.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@database/generated';

@Injectable()
export class PropertyService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: Prisma.PropertyCreateInput) {
    return this.databaseService.property.create({ data });
  }

  findAll() {
    return this.databaseService.property.findMany();
  }

  findOne(where: Prisma.PropertyWhereInput) {
    return this.databaseService.property.findFirst({ where });
  }

  update(id: number, data: Prisma.BuildingUpdateInput) {
    return this.databaseService.property.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.databaseService.property.delete({ where: { id } });
  }
}
