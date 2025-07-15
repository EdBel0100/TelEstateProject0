// src/location/location.service.ts

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@database/generated';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService:DatabaseService) {}

  create(data: Prisma.LocationCreateInput) {
    return this.databaseService.location.create({ data });
  }

  findAll() {
    return this.databaseService.location.findMany();
  }

  findOne(where: Prisma.LocationWhereInput) {
    return this.databaseService.location.findFirst({ where });
  }

  update(id: number, data: Prisma.LocationUpdateInput) {
    return this.databaseService.location.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.databaseService.location.delete({
      where: { id },
    });
  }
}
