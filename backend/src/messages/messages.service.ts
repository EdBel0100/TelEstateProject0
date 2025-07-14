import { Injectable } from '@nestjs/common';
import { Prisma } from '@database/generated';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class MessagesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createMessageDto: Prisma.MessagesCreateInput) {
    return this.databaseService.messages.create({
      data:createMessageDto
    })
  }

  async findAll() {
    return this.databaseService.messages.findMany({});
  }

  async findOne(id: number) {
    return this.databaseService.messages.findFirst({
      where:{
      id,
      }
    })
  }

  async getByConversation(conversationId: number) {
    return this.databaseService.messages.findMany({
      where: {
        conversationId,
      },
    });
  }
  


  async update(id: number, updateMessageDto: Prisma.MessagesUpdateInput) {
    return this.databaseService.messages.update({
      where:{
        id,
      },
      data: updateMessageDto

    })
  }

  async remove(id: number) {
    return this.databaseService.messages.delete({
      where:{
        id,
      }
    })
  }
}
