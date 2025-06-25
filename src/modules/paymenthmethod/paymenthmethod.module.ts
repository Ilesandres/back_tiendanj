import { Module } from '@nestjs/common';
import { PaymenthmethodController } from './paymenthmethod.controller';
import { PaymenthmethodService } from './paymenthmethod.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymenthMethodEntity } from './entity/paymenthMethod.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PaymenthMethodEntity]),
  ],
  controllers: [PaymenthmethodController],
  providers: [PaymenthmethodService],
  exports:[PaymenthmethodService]
})
export class PaymenthmethodModule {}
