import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTicketForTenantDto } from '@DTO/ticket-dto/create-ticket-for-tenants.dto';
import { GetTicketByLandlordDto } from '@DTO/ticket-dto/get-ticket-by-landlord.dto';


@Injectable()
export class TicketsService {
  constructor(private readonly databaseService: DatabaseService) {}

  //this should include picture upload in the future 
  
  async CreateForTenant(createTicketDto: CreateTicketForTenantDto) {
    const property = await this.databaseService.property.findFirst({
      where: {
        tenants: {
          some: {
            propertyId: createTicketDto.propertyId,
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
  


  async findManyByManager(ManagerCognitoId: string):Promise <GetTicketByLandlordDto[]> {
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


 