import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Prisma } from '@database/generated';
import { Query } from '@nestjs/common';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  //create message
  @Post()
  create(@Body() createMessageDto: Prisma.MessagesCreateInput) {
    return this.messagesService.create(createMessageDto);
  }

  //get all messages
  @Get("all")
  findAll() {
    return this.messagesService.findAll();
  }

  //get one message
  @Get('one/:id')
  findOne(@Query('id') id: string) {
    return this.messagesService.findOne(+id);
  }
  //get messages by conversation
  @Get('conversation')
  getByConversation(@Query('id') id: string) {
    return this.messagesService.getByConversation(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: Prisma.MessagesUpdateInput) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
