import { IsNotEmpty, IsOptional } from "class-validator";
import { TypeDniEntity } from "src/modules/typedni/entity/typedni.entity";

export class CreatePeopleDto{

    @IsNotEmpty({message:"el nombre es requerido"})
    name:string;
    @IsNotEmpty({message:"el apellido es requerido"})
    lastname:string;
    @IsNotEmpty({message:"el telefono es requerido"})
    phone:string;
    @IsNotEmpty({message:"la fecha de nacimiento es requerida"})
    birthdate:string;
    @IsOptional()
    email:string;
    @IsNotEmpty({message:"el tipo de documento es requerido"})
    typeDni:TypeDniEntity;
    @IsNotEmpty({message:"el dni es requerido"})
    dni:string;
}