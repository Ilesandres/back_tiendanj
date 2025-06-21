import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @IsNotEmpty({message:"el usuario es requerido"})
    user:string;
    @IsString()
    @IsNotEmpty({message:"la contraseña es requerida"})
    password:string;
}