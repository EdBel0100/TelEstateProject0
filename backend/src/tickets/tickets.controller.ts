import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, Logger } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketForTenantDto } from '@DTO/ticket-dto/create-ticket-for-tenants.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Roles } from '@guards/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';


@Controller('tickets/')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('tenant')
  @Post("tenant")
    CreateForTenant(
    @Body() createTicketDto: CreateTicketForTenantDto) {
    return this.ticketsService.CreateForTenant(createTicketDto);
  }


  @UseGuards(AuthGuard)
  @Roles("manager")
  @Get('manager')
  findManyByLandlord(@Query('managerCognitoId') managerCognitoId:string) {
    return this.ticketsService.findManyByManager(managerCognitoId)
  }


  @UseGuards(AuthGuard)
  @Roles("manager")
  @Delete("manager/:id")
  deleteById(@Param("id") id: number) {
  return this.ticketsService.deleteTicketById(Number(id));
}

}
