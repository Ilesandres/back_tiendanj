import { IsOptional } from "class-validator";
import { PaymenthMethodEntity } from "src/modules/paymenthmethod/entity/paymenthMethod.entity";
import { PaymentStatusEntity } from "src/modules/paymentstatus/entity/paymentstatus.entity";

export class UpdatePaymentDto{
    @IsOptional()
    method:PaymenthMethodEntity;
    @IsOptional()
    status:PaymentStatusEntity;
}