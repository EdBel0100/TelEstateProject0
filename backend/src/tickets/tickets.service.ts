import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@database/generated';
import { CreateTicketForTenantDto } from '@DTO/ticket-dto/create-ticket-for-tenants.dto';


@Injectable()
export class TicketsService {
  constructor(private readonly databaseService: DatabaseService) {}

  
  async CreateForTenant(createTicketDto: CreateTicketForTenantDto) {
    // Find property based on tenant cognito id
    const property = await this.databaseService.property.findFirst({
      where: {
        tenants: {
          some: {
            cognitoId: createTicketDto.tenantCognitoId,
          },
        },
      },
    });
  
    if (!property) {
      throw new Error("No property found for tenant");
    }
  
    // Create ticket linked to found property
    return this.databaseService.tickets.create({
      data: {
        title: createTicketDto.title,
        description: createTicketDto.description,
        status: createTicketDto.status,
        submittedAt: new Date(createTicketDto.submittedAt),
        tenantCognitoId: createTicketDto.tenantCognitoId,
        propertyId:property.id,
      },
    });
  }
  


  async findManyByManager(ManagerCognitoId: string) {
    return this.databaseService.tickets.findMany({
      where: {
        property: {
          manager: {
            cognitoId: ManagerCognitoId,
          },
        },
      },
      include: {
        property: {
          include: {
            manager: true,
            building: {
              include:{
                location:true
              }
            },
          },
        },
      },
    });
  }
  async deleteTicketById(id: number) {
    return this.databaseService.tickets.delete({ where: { id } });
  }
  
}


 