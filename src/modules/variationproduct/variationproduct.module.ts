import { Module } from '@nestjs/common';
import { VariationproductController } from './variationproduct.controller';
import { VariationproductService } from './variationproduct.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariationProductEntity } from './entity/variationproduct.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([VariationProductEntity]),
    ProductModule,
  ],
  controllers: [VariationproductController],
  providers: [VariationproductService]
})
export class VariationproductModule {}
