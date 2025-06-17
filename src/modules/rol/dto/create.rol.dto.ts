import { IsNotEmpty } from "class-validator";

export class RolEntity{

    @IsNotEmpty({message:"el rol es requerido"})
    rol:string;
}