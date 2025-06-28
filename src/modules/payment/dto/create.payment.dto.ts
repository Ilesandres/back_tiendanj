import { IsNotEmpty } from "class-validator";
import { PaymenthMethodEntity } from "src/modules/paymenthmethod/entity/paymenthMethod.entity";
import { PaymentStatusEntity } from "src/modules/paymentstatus/entity/paymentstatus.entity";



export class CreatePaymentDto{
    @IsNotEmpty({message:"el metodo de pago es requerido"})
    method:PaymenthMethodEntity;
    @IsNotEmpty({message:"el estado de pago es requerido"})
    status:PaymentStatusEntity;
}