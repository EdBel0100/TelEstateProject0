import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Prisma } from '@database/generated';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { lookupConversationBytenantOutputDto, lookupConversationBytenantInputDto } from '@DTO/conversation-dto/lookup-converstion-by-tenant.dto';



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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Get("/manager/lookup")
  lookupConverstaion(@Query("input") input:lookupConversationBytenantInputDto ) {
    return this.conversationsService.lookupConversationByTenant(input)
  }



@Post("tenant/signup")
createConversationForTenantSignup(@Body() data:Prisma.ConversationUncheckedCreateInput){
  return this.conversationsService.createConversationForTenantSignup(data)
}
}
