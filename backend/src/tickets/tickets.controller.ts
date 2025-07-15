import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, Logger } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketForTenantDto } from '@DTO/ticket-dto/ticket-create-for-tenants.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';


@Controller('tickets/')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard)
  @Post("tenant")
  async CreateForTenant(
    @Body() createTicketDto: CreateTicketForTenantDto,
    @Req() req: Request,
  ) {
    Logger.log("Authenticated User:", req.user); 
    return this.ticketsService.CreateForTenant(createTicketDto);
  }


  //gets all tickets attached to a landlord
  @Get('manager')
  findManyByLandlord(@Query('landlordCognitoId') landlordCognitoId:string) {
    return this.ticketsService.findManyByManager(landlordCognitoId)
  }

}
