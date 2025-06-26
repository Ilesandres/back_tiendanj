import { IsNotEmpty } from "class-validator";
import { OrderEntity } from "src/modules/order/entity/order.entity";
import { StatusShipmentEntity } from "src/modules/statusshipment/entity/statusshipment.entity";

export class CreateShipmentDto{
    @IsNotEmpty()
    order:OrderEntity;
    @IsNotEmpty()
    status:StatusShipmentEntity;
    @IsNotEmpty()
    details:string;
}