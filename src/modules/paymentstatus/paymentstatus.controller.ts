import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentstatusService } from './paymentstatus.service';
import { PaymentStatusEntity } from './entity/paymentstatus.entity';
import { CreatePaymentStatusDto } from './dto/create.paymentstatus.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('paymentstatus')
export class PaymentstatusController {
    constructor(
        private readonly paymentStatusService:PaymentstatusService
    ){}

    @Get("all")
    async findAll():Promise<PaymentStatusEntity[]>{
        try {
            return await this.paymentStatusService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<PaymentStatusEntity>{
        try {
            return await this.paymentStatusService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("name/:name")
    async findByName(@Param("name") name:string):Promise<PaymentStatusEntity>{
        try {
            return await this.paymentStatusService.findByName(name);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() paymentStatus:CreatePaymentStatusDto):Promise<PaymentStatusEntity>{
        try {
            return await this.paymentStatusService.create(paymentStatus);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() paymentStatus:CreatePaymentStatusDto):Promise<PaymentStatusEntity>{
        try {
            return await this.paymentStatusService.update(id,paymentStatus);
        } catch (error) {
            throw error;
        }
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.paymentStatusService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
