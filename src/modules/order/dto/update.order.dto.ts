import {   IsOptional } from "class-validator";
import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { PaymenthMethodEntity } from "src/modules/paymenthmethod/entity/paymenthMethod.entity";
import { PaymentStatusEntity } from "src/modules/paymentstatus/entity/paymentstatus.entity";
import { ShipmentEntity } from "src/modules/shipment/entity/shipment.entity";
import { TypeOrderEntity } from "src/modules/typeorder/entity/type.order.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

export class UpdateOrderDto{
    @IsOptional()
    user:UserEntity;
    @IsOptional()
    payment:PaymentEntity;
    @IsOptional()
    typeOrder:TypeOrderEntity;
    @IsOptional()
    paymentStatus:PaymentStatusEntity;
    @IsOptional()
    paymentMethod:PaymenthMethodEntity;

    @IsOptional()
    shipment:ShipmentEntity;
}