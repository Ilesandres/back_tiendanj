import { IsNotEmpty } from "class-validator";

export class CategoryEntity{
    @IsNotEmpty({message:"la categoria es requerida"})
    category:string;
}