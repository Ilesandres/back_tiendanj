import { IsNotEmpty, IsOptional } from "class-validator";
import { CreatePeopleDto } from "src/modules/people/dto/create.people.dto";
import { PeopleEntity } from "src/modules/people/entity/people.entity";
import { RolEntity } from "src/modules/rol/entity/rol.entity";

export class CreateUserDto{
    @IsNotEmpty({message:"los datos de la persona son requeridos"})
    people:CreatePeopleDto;
    @IsOptional()
    user:string;

    @IsOptional()
    password:string;

    @IsOptional()
    verificationCode:string;

    @IsOptional()
    token:string;

    @IsOptional()
    datesendverify:Date;

    @IsOptional()
    rol:RolEntity;

    @IsOptional()
    verify:boolean;
}