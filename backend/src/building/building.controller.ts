// src/building/building.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Query } from '@nestjs/common';
import { BuildingService } from './building.service';
import { Roles } from '@guards/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '@guards/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBuildingDto } from '@DTO/building-dto/create-building.dto';
import { UpdateBuildingDto } from '@DTO/building-dto/update-building.dto';

@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Post()
  create(@Body() data: CreateBuildingDto) {
    return this.buildingService.create(data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Get('/manager')
  getBuildingByManager(@Query('managerCognitoId') managerCognitoId:string) {
    return this.buildingService.getBuildingByManager(managerCognitoId)
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Post("/manager")
  async createBuilding(@Body() createBuildingDto: CreateBuildingDto) {
  const result = await this.buildingService.create(createBuildingDto);
  return result;
}

@UseGuards(AuthGuard, RolesGuard)
@Roles("manager")
@Patch("manager/:id")
  async updateBuilding(
    @Param("id") id: number,
    @Body() updateDto: UpdateBuildingDto,
  ) {
    return this.buildingService.update({ ...updateDto, id });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Delete('manager/:id')
  delete(@Param('id') id: number) {
    return this.buildingService.delete(Number(id));
  }
}
