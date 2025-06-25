import { forwardRef, Module } from '@nestjs/common';
import { VouchersabonosController } from './vouchersabonos.controller';
import { VouchersabonosService } from './vouchersabonos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersEntity } from './entity/vouchers.entity';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([VouchersEntity]),
    forwardRef(()=>PaymentModule)
  ],
  controllers: [VouchersabonosController],
  providers: [VouchersabonosService],
  exports:[VouchersabonosService]
})
export class VouchersabonosModule {}
