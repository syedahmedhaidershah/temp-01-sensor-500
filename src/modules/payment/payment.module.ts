import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './thirdparty/stripe/stripe.service';
import { RedisCacheModule } from '../cache/cache.module';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService
  ],
  imports: [
    RedisCacheModule,
  ],
})
export class PaymentModule { }
