import { Module } from '@nestjs/common';
import { PaymenthmethodController } from './paymenthmethod.controller';
import { PaymenthmethodService } from './paymenthmethod.service';

@Module({
  controllers: [PaymenthmethodController],
  providers: [PaymenthmethodService]
})
export class PaymenthmethodModule {}
