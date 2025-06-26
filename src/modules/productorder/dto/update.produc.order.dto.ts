import { IsNotEmpty, IsOptional } from "class-validator";
import { OrderEntity } from "src/modules/order/entity/order.entity";
import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";

export class UpdateProductOrderDto{
    @IsOptional()
    order:OrderEntity;

    @IsOptional()
    product:VariationProductEntity;

    @IsOptional()
    amount:number;
}