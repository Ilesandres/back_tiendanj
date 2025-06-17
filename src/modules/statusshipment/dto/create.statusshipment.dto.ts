import { IsNotEmpty } from "class-validator";

export class CreateStatusShipmentDto{
    @IsNotEmpty({message:"el estado es requerido"})
    status:string;
}