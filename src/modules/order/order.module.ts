import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { PaymentModule } from '../payment/payment.module';
import { PaymentstatusModule } from '../paymentstatus/paymentstatus.module';
import { PaymenthmethodModule } from '../paymenthmethod/paymenthmethod.module';
import { TypeorderModule } from '../typeorder/typeorder.module';
import { ShipmentModule } from '../shipment/shipment.module';
import { StatusshipmentModule } from '../statusshipment/statusshipment.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([OrderEntity]),
    PaymentModule,
    PaymentstatusModule,
    PaymenthmethodModule,
    TypeorderModule,
    StatusshipmentModule,
    ShipmentModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}
