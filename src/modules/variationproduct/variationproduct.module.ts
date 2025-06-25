import { Module } from '@nestjs/common';
import { VariationproductController } from './variationproduct.controller';
import { VariationproductService } from './variationproduct.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariationProductEntity } from './entity/variationproduct.entity';
import { ProductModule } from '../product/product.module';
import { SpiceModule } from '../spice/spice.module';
import { ColorModule } from '../color/color.module';
import { TypemeasuremedidaModule } from '../typemeasuremedida/typemeasuremedida.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([VariationProductEntity]),
    ProductModule,
    SpiceModule,
    ColorModule,
    TypemeasuremedidaModule
  ],
  controllers: [VariationproductController],
  providers: [VariationproductService]
})
export class VariationproductModule {}
