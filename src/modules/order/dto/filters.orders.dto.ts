import { IsOptional } from "class-validator";

export class FiltersOrdersDto{
    @IsOptional()
    user:string;
    @IsOptional()
    status:string;
    @IsOptional()
    date:string;
    @IsOptional()
    total:number;
    @IsOptional()
    paymentMethod:string;
    @IsOptional()
    paymentStatus:string;
    @IsOptional()
    shipment:string;
    @IsOptional()
    typeOrder:string;
    @IsOptional()
    statusShipment:string;
    @IsOptional()
    statusPayment:string;
    @IsOptional()
    statusPaymentMethod:string;
    @IsOptional()
    dni:string;
    @IsOptional()
    id:number;


}