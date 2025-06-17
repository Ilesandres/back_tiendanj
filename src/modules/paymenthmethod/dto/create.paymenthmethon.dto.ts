import { IsNotEmpty } from "class-validator";

export class CreatePaymenthMethodDto{
    @IsNotEmpty({message:"el metodo de pago es requerido"})
    method:string;
}