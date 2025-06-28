import { IsNotEmpty, IsOptional } from "class-validator";
import { TypeDniEntity } from "src/modules/typedni/entity/typedni.entity";

export class updatedPeopleDto{

    @IsOptional()
    name:string;
    @IsOptional()
    lastname:string;
    @IsOptional()
    phone:string;
    @IsOptional()
    birthdate:string;
    @IsOptional()
    email:string;
    @IsOptional()
    typeDni:TypeDniEntity;
    @IsOptional()
    dni:string;
}