import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Prisma } from '@database/generated';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from '@guards/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { CurrentUser } from '@guards/current-user.decorator';


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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("tenant")
  @Get('/tenant')
  getPropertyForTenant(@CurrentUser() user: { cognitoId: string }) {
    return this.propertyService.getPropertyForTenant(user.cognitoId);
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
