import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@database/generated';

@Injectable()
export class TicketsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTicketDto: Prisma.TicketsCreateInput) {
    return this.databaseService.tickets.create({
      data: createTicketDto,
    });
  }

  async findAll() {
    return this.databaseService.tickets.findMany({});
  }

  async findManyByLandlord(landlordCognitoId: string) {
    return this.databaseService.tickets.findMany({
      where: {
        property: {
          landlord: {
            cognitoId: landlordCognitoId,
          },
        },
      },
      include: {
        property: {
          include: {
            landlord: true,
          },
        },
      },
    });
  }

  async findManyByBuilding(buildingName: string) {
    return this.databaseService.tickets.findMany({
      where: {
        AND: [
          {
            property: {
              building: {
                name: buildingName,
              },
            },
          },
        ],
      },
      include: {
        property: {
          include: {
            landlord: true,
            building: true,
          },
        },
      },
    });
  }
  

  async findOne(id: number) {
    return this.databaseService.tickets.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateTicketDto: Prisma.TicketsUpdateInput) {
    return this.databaseService.tickets.update({
      where: {
        id
      },
      data: updateTicketDto
    });
  }

  remove(id: number) {
    return this.databaseService.tickets.delete({
      where:{
        id
      }
    });
  }
}
