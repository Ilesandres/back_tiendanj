import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto{
    @IsNotEmpty({message:"la categoria es requerida"})
    category:string;
}