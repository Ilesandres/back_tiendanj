import { IsNotEmpty } from "class-validator";
import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

export class CreateOrderDto{
    @IsNotEmpty({message:"el usuario es requerido"})
    user:UserEntity;
    @IsNotEmpty({message:"el pago es requerido"})
    payment:PaymentEntity;
}