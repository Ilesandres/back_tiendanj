import { IsNotEmpty, IsOptional } from "class-validator";
import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { ProductOrderEntity } from "src/modules/productorder/entity/productorder.entity";
import { ShipmentEntity } from "src/modules/shipment/entity/shipment.entity";
import { TypeOrderEntity } from "src/modules/typeorder/entity/type.order.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

export class CreateOrderDto{
    @IsNotEmpty({message:"el usuario es requerido"})
    user:UserEntity;
    @IsNotEmpty({message:"el pago es requerido"})
    payment:PaymentEntity;
    @IsNotEmpty({message:"el tipo de orden es requerido"})
    typeOrder:TypeOrderEntity;

    @IsOptional()
    shipment:ShipmentEntity;

    @IsOptional()
    productOrder:ProductOrderEntity[];
}