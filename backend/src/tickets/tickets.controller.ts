import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Prisma } from '@database/generated';

@Controller('tickets/')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}


  //Creates a new ticket
  @Post()
  create(@Body() createTicketDto: Prisma.TicketsCreateInput) {
    return this.ticketsService.create(createTicketDto);
  }

  //Gets all the tickets from the database
  @Get("all")
  findAll() {
    return this.ticketsService.findAll();
  }

  //gets all one ticket from the database
  @Get('one/:id')
  findOne(@Query('id') id: number) {
    return this.ticketsService.findOne(+id);
  }

  //gets all tickets attached to a landlord
  @Get('landlord')
  findManyByLandlord(@Query('landlordCognitoId') landlordCognitoId:string) {
    return this.ticketsService.findManyByLandlord(landlordCognitoId)
  }

  //gets all tickets attached to a building
  @Get('bulding')
  findManyByBuilding(@Query('buildingName') buildingName:string) {
    return this.ticketsService.findManyByLandlord(buildingName)
  }
  //change a ticket
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTicketDto: Prisma.TicketsUpdateInput) {
    return this.ticketsService.update(+id, updateTicketDto);
  }
  //deletes a ticket
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
