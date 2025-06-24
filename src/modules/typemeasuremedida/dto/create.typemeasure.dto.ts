import { IsNotEmpty } from "class-validator";


export class CreateTypeMeasureDto{
    @IsNotEmpty({message:"la medida es requerida"})
    measure:string;
}