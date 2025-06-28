import { IsNotEmpty, IsNumber } from "class-validator";
import { OrderEntity } from "src/modules/order/entity/order.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

export class InvoiceOrderDto {
    @IsNotEmpty()
    @IsNumber()
    orderId: number;
    
    @IsNotEmpty()
    order: OrderEntity;
    
    @IsNotEmpty()
    user: UserEntity;
}