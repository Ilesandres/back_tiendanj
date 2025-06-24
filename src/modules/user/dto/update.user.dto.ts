import { IsNotEmpty, IsOptional } from "class-validator";
import { updatedPeopleDto } from "src/modules/people/dto/update.people.dto";
import { PeopleEntity } from "src/modules/people/entity/people.entity";
import { RolEntity } from "src/modules/rol/entity/rol.entity";

export class UpdateUserDto{
    @IsOptional()
    people:updatedPeopleDto;
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