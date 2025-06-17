import { IsNotEmpty } from "class-validator";
import { OrderEntity } from "src/modules/order/entity/order.entity";
import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";

export class CreateProductOrderDto{
    @IsNotEmpty({message:"el pedido es requerido"})
    order:OrderEntity;

    @IsNotEmpty({message:"el producto es requerido"})
    product:VariationProductEntity;

    @IsNotEmpty({message:"la cantidad es requerida"})
    amount:number;
}