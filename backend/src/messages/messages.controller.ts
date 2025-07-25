import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Prisma } from '@database/generated';
import { Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMessageDto: Prisma.MessagesUncheckedCreateInput) {
    return this.messagesService.create(createMessageDto);
  }

  @Get('/conversation')
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
