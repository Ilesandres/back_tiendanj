import { Module } from '@nestjs/common';
import { PaymentstatusController } from './paymentstatus.controller';
import { PaymentstatusService } from './paymentstatus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatusEntity } from './entity/paymentstatus.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PaymentStatusEntity]),
  ],
  controllers: [PaymentstatusController],
  providers: [PaymentstatusService],
  exports:[PaymentstatusService]
})
export class PaymentstatusModule {}
