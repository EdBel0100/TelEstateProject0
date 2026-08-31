import { Prisma } from '@database/generated';
import { Injectable,Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GetConversationByTenantDto } from '@DTO/conversation-dto/get-conversation-by-tenant.dto';
import {GetConversationByManagerDto} from "@DTO/conversation-dto/get-conversations-by-manager.dto"
import { lookupConversationBytenantOutputDto, lookupConversationBytenantInputDto } from '@DTO/conversation-dto/lookup-converstion-by-tenant.dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly databaseService: DatabaseService){}


  //should be created on tenant sign up
  async create(createConversationDto: Prisma.ConversationCreateInput) {

    try {
      const created = await this.databaseService.conversation.create({
        data: createConversationDto,
      });
      return created;
    } catch (error) {
      throw error;
    }
  }
  

  getConversationsByManager(managerCognitoId: string): Promise<GetConversationByManagerDto[]> {
    return this.databaseService.conversation.findMany({
      where: {
        managerCognitoId,
      },
      include: {
        messages: true,
        tenant: true,
      },
    });
  }

  lookupConversationByTenant(input:lookupConversationBytenantInputDto): Promise<lookupConversationBytenantOutputDto[]> {
    return this.databaseService.conversation.findMany({
      where: {tenant:{firstName:input.tenantFirstName, lastName:input.tenantLastName}},
      include: {
        messages: true,
        tenant:true 
      }
    })
  }

  getConversationsByTenant(tenantCognitoId: string): Promise<GetConversationByTenantDto[]> {
  return this.databaseService.conversation.findMany({
    where: { tenantCognitoId },
    include: { messages: true },
  });
}


  async createConversationForTenantSignup(data: Prisma.ConversationUncheckedCreateInput) {
    return this.databaseService.conversation.create({ data });
  }

  deleteConversation(id:number){
    return this.databaseService.conversation.delete({
      where:{
        id
      }
    })
  }

 
}
