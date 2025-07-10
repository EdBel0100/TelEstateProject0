import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Prisma } from '@database/generated';

@Controller('tickets/')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: Prisma.TicketsCreateInput) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get("all")
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: number) {
    return this.ticketsService.findOne(+id);
  }

  @Get('landlord')
  findManyByLandlord(@Query('landlordCognitoId') landlordCognitoId:string) {
    return this.ticketsService.findManyByLandlord(landlordCognitoId)
  }

  @Get('bulding')
  findManyByBuilding(@Query('buildingName') buildingName:string) {
    return this.ticketsService.findManyByLandlord(buildingName)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTicketDto: Prisma.TicketsUpdateInput) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
