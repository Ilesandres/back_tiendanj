import { IsNotEmpty } from "class-validator";

export class CreateTypeDni{
    @IsNotEmpty({message:"El nombre es requerido"})
    name:string;
}