import { IsNotEmpty } from "class-validator";
import { PaymentEntity } from "src/modules/payment/entity/payment.entity";

export class CreateVoucherDto{
    @IsNotEmpty({message:"el pago es requerido"})
    payment:PaymentEntity;

    @IsNotEmpty({message:"el valor es requerido"})
    value:number;
}