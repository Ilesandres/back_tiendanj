import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { PaymenthmethodModule } from '../paymenthmethod/paymenthmethod.module';
import { PaymentstatusModule } from '../paymentstatus/paymentstatus.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([PaymentEntity]),
    forwardRef(()=>PaymenthmethodModule),
    PaymentstatusModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports:[PaymentService]
})
export class PaymentModule {}
