import { IsNotEmpty } from "class-validator";

export class CreatePaymentStatusDto{
    @IsNotEmpty({message:"el estado de pago es requerido"})
    status:string;
}