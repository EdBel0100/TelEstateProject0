import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import CreateTenantDto from '@DTO/tenant-dto/create-tenant.dto';
import { GetTenantManagerAndProperty } from '@DTO/tenant-dto/get-tenant-manager-and-property.dto';
import { Tenant } from '@database/generated';

@Injectable()
export class TenantService {
  constructor(private readonly databaseService: DatabaseService) {}

//to be implemented, a method that checks if the lease is done and wont renew, and if it is done then drop the tenant from the database


// this should be updated in the future since connecting thenants to landlords through adress and postalCode aint so secure
async create(data: CreateTenantDto) {
  Logger.log(`Attempting to find property for apartment ${data.apartmentNumber} at ${data.address}, ${data.postalCode}`);

  const property = await this.databaseService.property.findFirst({
    where: {
      apartmentNumber: data.apartmentNumber,
      building: {
        location: {
          address: data.address,
          postalCode: data.postalCode,
        },
      },
    },
  });

  if (!property) {
    Logger.warn(`No property found for apartment ${data.apartmentNumber} at ${data.address}, ${data.postalCode}`);
    throw new NotFoundException('Property not found for given apartment and address.');
  }

  Logger.log(`Property found (ID: ${property.id}), creating tenant ${data.firstName} ${data.lastName}`);

  const tenant = await this.databaseService.tenant.create({
    data: {
      cognitoId: data.cognitoId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      propertyId: property.id,
    },
  });

  Logger.log(`Tenant created with ID: ${tenant.id}`);

  return tenant;
}
  async getAllTenantsByManager(managerCognitoId:string):Promise<Tenant[]>{
    return await this.databaseService.tenant.findMany({
      where:{
        property:{
          managerCognitoId
        }
      }
    })
  }
  
  async getTenantManager(
    tenantCognitoId: string
  ): Promise<GetTenantManagerAndProperty> {
    const tenant = await this.databaseService.tenant.findFirst({
      where: { cognitoId: tenantCognitoId },
      include: {
        property: {
          include: {
            manager: true,
          },
        },
      },
    });
  
    if (!tenant) {
      throw new Error(`Tenant with cognitoId ${tenantCognitoId} not found`);
    }
  
    return tenant;
  }
}