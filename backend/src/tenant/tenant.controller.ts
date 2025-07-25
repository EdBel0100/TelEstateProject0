import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TenantService } from './tenant.service';
import CreateTenantDto from "@DTO/tenant-dto/create-tenant.dto"

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Get("/manager")
  getAllTenantsByManager(@Query("managerCognitoId") managerCognitoId:string){
    return this.tenantService.getAllTenantsByManager(managerCognitoId)
  }

  @Get("/tenant/manager")
  getTenantManager(@Query("tenantCognitoId") tenantCognitoId:string){
    return this.tenantService.getTenantManager(tenantCognitoId)
  }

} 