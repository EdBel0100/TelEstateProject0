import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import CreateTenantDto from '@DTO/tenant-dto/create-tenant.dto';


@Injectable()
export class TenantService {
  constructor(private readonly databaseService: DatabaseService) {}

//to be implemented, a method that checks if the lease is done and wont renew, and if it is done then drop the tenant from the database


// this should be updated in the future since connecting thenants to landlords through adress and postalCode aint so secure
  async create(data: CreateTenantDto) {
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
      throw new NotFoundException('Property not found for given apartment and address.');
    }

    const tenant = await this.databaseService.tenant.create({
      data: {
        cognitoId: data.cognitoId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        propertyId: property.id, // ✅ link using propertyId directly
      },
    });

    return tenant;
  }

  async getAllTenantsByManager(managerCognitoId:string){
    return await this.databaseService.tenant.findMany({
      where:{
        property:{
          managerCognitoId
        }
      }
    })
  }
}
