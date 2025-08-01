import { Module } from '@nestjs/common';
import { PaymentplansService } from './paymentplans.service';
import { PaymentplansController } from './paymentplans.controller';

@Module({
  controllers: [PaymentplansController],
  providers: [PaymentplansService],
})
export class PaymentplansModule {}
