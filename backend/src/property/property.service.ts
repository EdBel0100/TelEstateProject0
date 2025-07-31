// src/building/building.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@database/generated';
import { GetPropertyForTenant } from '@DTO/property-dto/get-property-for-tenant.dto';

@Injectable()
export class PropertyService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: Prisma.PropertyCreateInput) {
    return this.databaseService.property.create({ data });
  }

  findAll() {
    return this.databaseService.property.findMany();
  }

  async getPropertyForTenant(
    tenantCognitoId: string
  ): Promise<GetPropertyForTenant> {
    const property = await this.databaseService.property.findFirst({
      where: {
        tenants: {
          some: { cognitoId: tenantCognitoId },
        },
      },
      include: { tenants: true, building:{ include:{location:true}} },
    });
  
    if (!property) {
      throw new Error('Property not found for tenant');
    }
    return property;
  }
  
  
  

  update(id: number, data: Prisma.BuildingUpdateInput) {
    return this.databaseService.property.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.databaseService.property.delete({ where: { id } });
  }
}
