import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Prisma } from '@database/generated';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';



@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() createConversationDto: Prisma.ConversationCreateInput) {
    return this.conversationsService.create(createConversationDto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Get("/manager")
  getByManagerCognitoId(@Query("managerCognitoId") managerCognitoId:string){
    return this.conversationsService.getConversationsByManager(managerCognitoId)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("tenant")
  @Get("/tenant")
  getByTenantCognitoId(@Query("tenantCognitoId") tenantCognitoId:string){
    return this.conversationsService.getConversationsByTenant(tenantCognitoId)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Delete(`/manager/:id`)
  deleteConversation(@Param("id") id:number){
    return this.conversationsService.deleteConversation(Number(id))
  }



@Post("tenant/signup")
createConversationForTenantSignup(@Body() data:Prisma.ConversationUncheckedCreateInput){
  return this.conversationsService.createConversationForTenantSignup(data)
}
}
