import { IsNotEmpty } from "class-validator";

export class VerifyUserDto{
    @IsNotEmpty({message:"el nombre del usuario es requerido"})
    name:string;

    @IsNotEmpty({message:"el codigo de verificacion es requerido"})
    verificationCode:string;

    @IsNotEmpty({message:"el correo electronico es requerido"})
    email:string;

    @IsNotEmpty({message:"el token es requerido"})
    token:string;
    
    @IsNotEmpty({message:"el usuario es requerido"})
    user:string;

    @IsNotEmpty({message:"el url es requerido"})
    url:string;
}