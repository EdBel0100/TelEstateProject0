import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBuildingDto } from '@DTO/building-dto/create-building.dto';
import { UpdateBuildingDto } from '@DTO/building-dto/update-building.dto';
import { GetBuildingByManagerDto } from '@DTO/building-dto/get-building-by-managerCognitoId.dto';

@Injectable()
export class BuildingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateBuildingDto) {
    const { managerCognitoId, location, properties, ...rest } = data;

    const result = await this.databaseService.building.create({
      data: {
        ...rest,
        manager: {
          connect: { cognitoId: managerCognitoId },
        },
        location: {
          create: location, 
        },
        properties: properties
          ? {
              create: properties.map((prop) => ({
                ...prop,
                manager: {
                  connect: { cognitoId: managerCognitoId },
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
                },
                create: {
                  apartmentNumber: prop.apartmentNumber,
                  numberOfRooms: prop.numberOfRooms,
                  numberOfBathrooms: prop.numberOfBathrooms,
                  size: prop.size,
                  manager: {
                    connect: { cognitoId: managerCognitoId },
                  },
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
  
    // 🧮 Count current properties after update and set the numberOfProperties field
    const currentPropCount = await this.databaseService.property.count({
      where: { buildingId: Number(id) },
    });
  
    // 🔁 Update numberOfProperties
    await this.databaseService.building.update({
      where: { id: Number(id) },
      data: { numberOfProperty: currentPropCount },
    });
  
    return result;
  }
  

  getBuildingByManager(managerCognitoId: string): Promise<GetBuildingByManagerDto[]> {
    return this.databaseService.building.findMany({
      where: { managerCognitoId },
      include: {
        manager: true,
        location: true,
        properties: {
          include: {
            tenants: true,  
          },
        },
      },
    });
  }
  
      
  async delete(id: number) {
    const building = await this.databaseService.building.findUnique({
      where: { id: Number(id) },
      select: { locationId: true },
    });
  
    if (!building) {
      throw new Error(`Building with ID ${id} not found`);
    }
  
    return this.databaseService.$transaction([
      this.databaseService.building.delete({
        where: { id: Number(id) },
      }),
      this.databaseService.location.delete({
        where: { id: building.locationId },
      }),
    ]);
  }
  


}
