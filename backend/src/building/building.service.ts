import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBuildingDto } from '@DTO/building-dto/create-building.dto';
import { UpdateBuildingDto } from '@DTO/building-dto/update-building.dto';
import { GetBuildingByManagerDto } from '@DTO/building-dto/get-building-by-managerCognitoId.dto';

function toIsoDate(dateString?: string): string {
  if (!dateString) throw new Error("No date provided");
  const d = new Date(dateString);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return d.toISOString();
}



@Injectable()
export class BuildingService {
  constructor(private readonly databaseService: DatabaseService) {}

  
  async create(data: CreateBuildingDto) {
    const { managerCognitoId, location, properties, ...rest } = data;
  
    // If properties have leases, convert lease dates:
    const preparedProperties = properties?.map((property) => {
      const lease = property.lease
        ? {
            ...property.lease,
            startDate: toIsoDate(property.lease.startDate),
            endDate: toIsoDate(property.lease.endDate),
            rentDueDateEachMonth: property.lease.rentDueDateEachMonth,
            monthlyPrice:property.lease.monthlyPrice,
            propertyId: undefined,
          }
        : undefined;
  
      return {
        ...property,
        lease: lease ? { create: lease } : undefined,
        manager: { connect: { cognitoId: managerCognitoId } },
      };
    });
  
    const result = await this.databaseService.building.create({
      data: {
        ...rest,
        manager: {
          connect: { cognitoId: managerCognitoId },
        },
        location: {
          create: location,
        },
        properties: preparedProperties
          ? {
              create: preparedProperties,
            }
          : undefined,
      },
      include: {
        location: true,
        properties: {
          include: {
            lease: true,
          },
        },
        manager: true,
      },
    });
  
    return result;
  }
  
  
  async update(data: UpdateBuildingDto) {
    const { id, managerCognitoId, location, properties, ...rest } = data;
  
    // Fetch existing property IDs
    const existingProps = await this.databaseService.property.findMany({
      where: { buildingId: Number(id) },
      select: { id: true },
    });
  
    const incomingPropIds = properties?.filter(p => p.id).map(p => p.id) ?? [];
  
    const propsToDelete = existingProps
      .filter((p) => !incomingPropIds.includes(p.id))
      .map((p) => p.id);
  
    if (propsToDelete.length > 0) {
      await this.databaseService.property.deleteMany({
        where: { id: { in: propsToDelete } },
      });
    }
    const result = await this.databaseService.building.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        manager: {
          connect: { cognitoId: managerCognitoId },
        },
        location: {
          update: {
            address: location.address,
            city: location.city,
            state: location.state,
            country: location.country,
            postalCode: location.postalCode,
          },
        },
        properties: properties
  ? {
      upsert: properties.map((prop) => ({
        where: prop.id ? { id: prop.id } : { id: -1 },
        update: {
          apartmentNumber: prop.apartmentNumber,
          numberOfRooms: prop.numberOfRooms,
          numberOfBathrooms: prop.numberOfBathrooms,
          size: prop.size,
          manager: {
            connect: { cognitoId: managerCognitoId },
          },
          lease: prop.lease
          ? {
              upsert: {
                update: {
                  startDate: new Date(prop.lease.startDate),
                  endDate: new Date(prop.lease.endDate),
                  deposit: prop.lease.deposit,
                  typeOfLease: prop.lease.typeOfLease,
                  rentDueDateEachMonth: prop.lease.rentDueDateEachMonth,
                  monthlyPrice: prop.lease.monthlyPrice, // ✅
                },
                create: {
                  startDate: new Date(prop.lease.startDate),
                  endDate: new Date(prop.lease.endDate),
                  deposit: prop.lease.deposit,
                  typeOfLease: prop.lease.typeOfLease,
                  rentDueDateEachMonth: prop.lease.rentDueDateEachMonth,
                  monthlyPrice: prop.lease.monthlyPrice, // ✅ ADD THIS LINE
                },
              },
            }
          : undefined,
          },
        create: {
          apartmentNumber: prop.apartmentNumber,
          numberOfRooms: prop.numberOfRooms,
          numberOfBathrooms: prop.numberOfBathrooms,
          size: prop.size,
          manager: {
            connect: { cognitoId: managerCognitoId },
          },
          lease: prop.lease
            ? {
                create: {
                  startDate: new Date(prop.lease.startDate),
                  endDate: new Date(prop.lease.endDate),
                  deposit: prop.lease.deposit,
                  typeOfLease: prop.lease.typeOfLease,
                  rentDueDateEachMonth:  prop.lease.rentDueDateEachMonth,
                  monthlyPrice: prop.lease.monthlyPrice
                },
              }
            : undefined,
        },
      })),
    }
  : undefined,

      },
      include: {
        location: true,
        properties: true,
        manager: true,
      },
    });
  
    const currentPropCount = await this.databaseService.property.count({
      where: { buildingId: Number(id) },
    });
  

    await this.databaseService.building.update({
      where: { id: Number(id) },
      data: { numberOfProperty: currentPropCount },
    });
  
    return result;
  }
  

  getBuildingByManager(managerCognitoId: string): Promise<GetBuildingByManagerDto[]> {
    const payload =  this.databaseService.building.findMany({
      where: { managerCognitoId },
      include: {
        manager: true,
        location: true,
        properties: {
          include: {
            tenants: true, 
            lease:true 
          },
        },
      },
    });
    return payload
  }
  
      
  async delete(id: number) {
    const building = await this.databaseService.building.findUnique({
      where: { id: Number(id) },
      select: { locationId: true },
    });
  
    if (!building) {
      throw new Error(`Building with ID ${id} not found`);
    }
  
    // Just delete the building — location will be cascade deleted automatically
    return this.databaseService.building.delete({
      where: { id: Number(id) },
    });
  }
  


}
