import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './entity/payment.entity';
import { CreatePaymentDto } from './dto/create.payment.dto';
import { UpdatePaymentDto } from './dto/update.payment.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService:PaymentService,
    ){}

    @Get("all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findAll():Promise<PaymentEntity[]>{
        try {
            return await this.paymentService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("id/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findById(@Param("id") id:number):Promise<PaymentEntity>{
        try {
            return await this.paymentService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("order/:orderId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findByOrderId(@Param("orderId") orderId:number):Promise<PaymentEntity>{
        try {
            return await this.paymentService.findByOrderId(orderId);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() payment:CreatePaymentDto):Promise<PaymentEntity>{
        try {
            return await this.paymentService.create(payment);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number, @Body() payment:UpdatePaymentDto):Promise<PaymentEntity>{
        try {
            return await this.paymentService.update(id, payment);
        } catch (error) {
            throw error;
        }
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.paymentService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
