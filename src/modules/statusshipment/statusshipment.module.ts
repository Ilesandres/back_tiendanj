import { Module } from '@nestjs/common';
import { StatusshipmentController } from './statusshipment.controller';
import { StatusshipmentService } from './statusshipment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusShipmentEntity } from './entity/statusshipment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([StatusShipmentEntity])
  ],
  controllers: [StatusshipmentController],
  providers: [StatusshipmentService],
  exports:[StatusshipmentService]
})
export class StatusshipmentModule {}
