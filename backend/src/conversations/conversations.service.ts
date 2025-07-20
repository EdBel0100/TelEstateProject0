import { Prisma } from '@database/generated';
import { Injectable,Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ConversationsService {
  constructor(private readonly databaseService: DatabaseService){}
  logger = new Logger()

  //should be created on tenant sign up
  async create(createConversationDto: Prisma.ConversationCreateInput) {
    this.logger.log('Creating conversation with data: ' + JSON.stringify(createConversationDto));

    try {
      const created = await this.databaseService.conversation.create({
        data: createConversationDto,
      });

      this.logger.log('Conversation created successfully: ' + JSON.stringify(created));
      return created;
    } catch (error) {
      this.logger.error('Failed to create conversation:', error);
      throw error;
    }
  }
  

  getConversationsByManager(managerCognitoId:string){
    return this.databaseService.conversation.findMany({
      where:{
        managerCognitoId,
      },
      include:{
        messages:true,
        tenant:true,
      }
    })
  }

  getConversationsByTenant(tenantCognitoId:string){
    return this.databaseService.conversation.findFirst({
    where:{
      tenantCognitoId,
    },
    include:{
      messages:true,
    }
  })
  }

  deleteConversation(id:number){
    return this.databaseService.conversation.delete({
      where:{
        id
      }
    })
  }

 
}
