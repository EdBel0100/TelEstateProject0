import { Injectable } from '@nestjs/common';
import { Prisma } from '@database/generated';
import { DatabaseService } from 'src/database/database.service';


@Injectable()


export class TenantService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createTenantDto: Prisma.TenantCreateInput) { 
    return this.databaseService.tenant.create({
      data: createTenantDto,
    });
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number, updateTenantDto: Prisma.TenantUpdateInput) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
