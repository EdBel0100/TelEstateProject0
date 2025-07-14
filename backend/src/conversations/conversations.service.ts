import { Prisma } from '@database/generated';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ConversationsService {
  constructor(private readonly databaseService: DatabaseService){}

  create(createConversationDto: Prisma.ConversationCreateInput) {
    return 'This action adds a new conversation';
  }

  findAll() {
    return `This action returns all conversations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  //Get all conversations by landlord 

  //Get conversations by tenant
  
  //Get all conversations by tradeperson

  update(id: number, updateConversationDto: Prisma.ConversationUpdateInput) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
