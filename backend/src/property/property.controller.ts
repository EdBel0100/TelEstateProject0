import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Prisma } from '@database/generated';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() data: Prisma.PropertyCreateInput) {
    return this.propertyService.create(data);
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get('/tenant')
  getPropertyForTenant(@Query('tenantCognitoId') tenantCognitoId: string) {
    return this.propertyService.getPropertyForTenant(tenantCognitoId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PropertyUpdateInput) {
    return this.propertyService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(Number(id));
  }
}
