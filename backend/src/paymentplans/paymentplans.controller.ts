import { Controller, Get, Post, Body, Patch, Req } from '@nestjs/common';
import { PaymentplansService } from './paymentplans.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { PaymentPlanCoherenceDto } from '@DTO/payment-plan-dto/get-manager-payment-coherence-per-property.dto';
import { NotFoundException } from '@nestjs/common';
import { CurrentUser } from '@guards/current-user.decorator';


@Controller('paymentplans')
export class PaymentplansController {
  constructor(private readonly paymentplansService: PaymentplansService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("tenant")
  @Post("/tenant")
  async createTenantPaymentPlan(
  @Body('setPrice') setPrice: number,
  @CurrentUser() user: { cognitoId: string}
) {
  return this.paymentplansService.createTenantPaymentPlan(setPrice, user.cognitoId);
}


  @UseGuards(AuthGuard, RolesGuard)
  @Roles("tenant")
  @Get("/tenant")
  async getTenantPaymentPlan(
  @CurrentUser() user: { cognitoId: string}
  ) {
  return this.paymentplansService.getTenantPaymentPlan(user.cognitoId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("tenant")
  @Patch('/tenant')
  async updateByTenant(
    @CurrentUser() user: { cognitoId: string},
  @Body('setPrice') setPrice: number,
) {
  return this.paymentplansService.editTenantPaymentPlan(setPrice, user.cognitoId);
}




  @UseGuards(AuthGuard, RolesGuard)
  @Roles("manager")
  @Get('/manager/coherence')
  getManagerPaymentPlanCoherencePerProperty(
    @CurrentUser() user: { cognitoId: string},
  ): Promise<PaymentPlanCoherenceDto[]> {
    const managerCognitoId = user.cognitoId
    if (!managerCognitoId) {
      throw new NotFoundException('managerCognitoId query param is required');
    }
    return this.paymentplansService.getManagerPaymentPlanCoherencePerProperty(
      managerCognitoId,
    );
  }

}
