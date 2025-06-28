import { IsNotEmpty, IsString } from "class-validator";

export class CreateTypeOrderDto{

    @IsNotEmpty({message:"el tipo de orden es requerido"})
    @IsString({message:"el tipo de orden debe ser un string"})
    type:string;

}