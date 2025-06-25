import { Module } from '@nestjs/common';
import { TypeorderController } from './typeorder.controller';
import { TypeorderService } from './typeorder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrderEntity } from './entity/type.order.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([TypeOrderEntity]),
  ],
  controllers: [TypeorderController],
  providers: [TypeorderService],
  exports:[TypeorderService]
})
export class TypeorderModule {}
