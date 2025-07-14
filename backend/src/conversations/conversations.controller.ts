import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Prisma } from '@database/generated';


@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() createConversationDto: Prisma.ConversationCreateInput) {
    return this.conversationsService.create(createConversationDto);
  }

  @Get()
  findAll() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationDto: Prisma.ConversationUpdateInput) {
    return this.conversationsService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(+id);
  }
}
