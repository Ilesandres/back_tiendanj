import { Module } from '@nestjs/common';
import { ProductorderController } from './productorder.controller';
import { ProductorderService } from './productorder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrderEntity } from './entity/productorder.entity';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { VariationproductService } from '../variationproduct/variationproduct.service';
import { VariationproductModule } from '../variationproduct/variationproduct.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([ProductOrderEntity]),
    ProductModule,
    OrderModule,
    VariationproductModule
  ],
  controllers: [ProductorderController],
  providers: [ProductorderService]
})
export class ProductorderModule {}
