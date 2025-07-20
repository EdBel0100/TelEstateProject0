import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBuildingDto } from '@DTO/building-dto/create-building.dto';
import { UpdateBuildingDto } from '@DTO/building-dto/update-building.dto';
import { Logger } from '@nestjs/common';

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
    const logger = new Logger('BuildingService:update');
  
    const { id, managerCognitoId, location, properties, ...rest } = data;
  
    logger.log(`Starting update for building id: ${id}`);
    logger.log(`Manager CognitoId: ${managerCognitoId}`);
    logger.log(`Location data: ${JSON.stringify(location)}`);
    logger.log(`Other building fields: ${JSON.stringify(rest)}`);
    logger.log(`Incoming properties: ${JSON.stringify(properties)}`);
  
    // Step 1: Remove orphaned properties
    const existingProps = await this.databaseService.property.findMany({
      where: { buildingId: Number(id) },
      select: { id: true },
    });
  
    logger.log(`Existing properties for building ${id}: ${JSON.stringify(existingProps)}`);
  
    const incomingPropIds = properties?.filter(p => p.id).map(p => p.id) ?? [];
    logger.log(`Incoming property IDs: ${JSON.stringify(incomingPropIds)}`);
  
    const propsToDelete = existingProps
      .filter((p) => !incomingPropIds.includes(p.id))
      .map((p) => p.id);
  
    logger.log(`Properties to delete: ${JSON.stringify(propsToDelete)}`);
  
    if (propsToDelete.length > 0) {
      logger.log(`Deleting orphaned properties...`);
      await this.databaseService.property.deleteMany({
        where: { id: { in: propsToDelete } },
      });
      logger.log(`Deleted orphaned properties with IDs: ${JSON.stringify(propsToDelete)}`);
    } else {
      logger.log(`No orphaned properties to delete.`);
    }
  
    logger.log(`Updating building with new data...`);
  
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
  
    logger.log(`Building updated successfully: ${JSON.stringify(result)}`);
  
    return result;
  }

  getBuildingByManager(managerCognitoId: string) {
    return this.databaseService.building.findMany({
      where: { managerCognitoId },
      include: {
        manager: {
          select: {
            cognitoId: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        location: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            country: true,
            postalCode: true,
          },
        },
        properties: {
          select: {
            id: true,
            apartmentNumber: true,
            numberOfBathrooms: true,
            numberOfRooms: true,
            size:true,
            tenants: {
              select: {             // Add tenant id
                cognitoId: true,       // Add cognitoId
                email: true,           // Add email
                firstName: true,
                lastName: true,
                phoneNumber: true,     // Add phone number    // Optional if needed in frontend
              },
            },
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
