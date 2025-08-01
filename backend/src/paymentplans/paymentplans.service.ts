import { Injectable } from '@nestjs/common';
import { PaymentPlanCoherenceDto } from '@DTO/payment-plan-dto/get-manager-payment-coherence-per-property.dto';
import { NotFoundException } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PaymentplansService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createTenantPaymentPlan(
    setPrice: number,
    tenantCognitoId: string,
  ) {
    const tenant = await this.databaseService.tenant.findUnique({
      where: { cognitoId: tenantCognitoId },
      include: {
        property: {
          include: {
            lease: true,
          },
        },
      },
    });

    if (!tenant || !tenant.property?.lease) {
      throw new NotFoundException('Tenant or associated lease not found.');
    }

    // Step 2: Create the PaymentPlan
    return this.databaseService.paymentPlan.create({
      data: {
        setPrice: setPrice,
        tenantCognitoId: tenant.cognitoId,
        leaseId: tenant.property.lease.id,
        paymentDate: new Date(), // or however you want to generate the paymentDate
      },
    });
  }

  async getTenantPaymentPlan(tenantCognitoId:string){
    return this.databaseService.paymentPlan.findUnique({where:{tenantCognitoId}})
  }


  
  async editTenantPaymentPlan(
    setPrice:number,
    tenantCognitoId: string,
  ) {
    const tenant = await this.databaseService.tenant.findUnique({
      where: { cognitoId: tenantCognitoId },
      include: {
        property: {
          include: {
            lease: true,
          },
        },
      },
    });
    if (!tenant || !tenant.property?.lease) {
      throw new NotFoundException('Tenant or associated lease not found.');
    }

    const existing = await this.databaseService.paymentPlan.findFirst({
      where: {
        tenant: {
            cognitoId: tenantCognitoId,
        },
      },
    });
    
  
    if (!existing) {
      throw new NotFoundException(
        `No PaymentPlan found for tenantCognitoId ${tenantCognitoId}`,
      );
    }
  
    return this.databaseService.paymentPlan.update({
      where: { id: existing.id },
      data: {
        setPrice: setPrice,
        tenantCognitoId: tenant.cognitoId,
        leaseId: tenant.property.lease.id,
        paymentDate: new Date(), // or however you want to generate the paymentDate
      },
    });
  }
  


  async getManagerPaymentPlanCoherencePerProperty(
    managerCognitoId: string,
  ): Promise<PaymentPlanCoherenceDto[]> {
    const properties = await this.databaseService.property.findMany({
      where: { managerCognitoId },
      include: { building: true },
    });
  
    if (!properties.length) {
      throw new Error('No properties found for this manager');
    }
  
    const result: PaymentPlanCoherenceDto[] = [];
  
    for (const property of properties) {
      const lease = await this.databaseService.lease.findFirst({
        where: { propertyId: property.id },
      });
  
      if (!lease) {
        result.push({
          propertyId: property.id,
          isRentAddingUp: false,
          property,
        });
        continue;
      }
  
      const paymentPlans = await this.databaseService.paymentPlan.findMany({
        where: { leaseId: lease.id },
      });
  
      const actual = paymentPlans.reduce((sum, plan) => sum + plan.setPrice, 0);
      const expected = lease.monthlyPrice ?? 0;
  
      result.push({
        propertyId: property.id,
        isRentAddingUp: actual === expected,
        expected,
        actual,
        property,
      });
    }
  
    return result;
  }
  
  

}
