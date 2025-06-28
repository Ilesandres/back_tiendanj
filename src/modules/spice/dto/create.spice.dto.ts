import { IsNotEmpty, IsString } from "class-validator";

export class CreateSpiceDto{

    @IsNotEmpty({message:"el nombre del sabor es requerido"})
    @IsString({message:"el nombre del sabor debe ser un string"})
    spice:string;


}