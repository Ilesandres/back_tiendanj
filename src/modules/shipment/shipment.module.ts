import { forwardRef, Module } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentEntity } from './entity/shipment.entity';
import { StatusshipmentModule } from '../statusshipment/statusshipment.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([ShipmentEntity]),
    forwardRef(() => StatusshipmentModule),
    forwardRef(() => OrderModule)
  ],
  controllers: [ShipmentController],
  providers: [ShipmentService],
  exports:[ShipmentService]
})
export class ShipmentModule {}
