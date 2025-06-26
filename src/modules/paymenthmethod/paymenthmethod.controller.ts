import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymenthmethodService } from './paymenthmethod.service';
import { PaymenthMethodEntity } from './entity/paymenthMethod.entity';
import { CreatePaymenthMethodDto } from './dto/create.paymenthmethon.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('paymenthmethod')
export class PaymenthmethodController {
    constructor(
        private readonly paymenthMethodService:PaymenthmethodService
    ){}

    @Get("all")
    async findAll():Promise<PaymenthMethodEntity[]>{
        try {
            return await this.paymenthMethodService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<PaymenthMethodEntity>{
        try {
            return await this.paymenthMethodService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("name/:name")
    async findByName(@Param("name") name:string):Promise<PaymenthMethodEntity>{
        try {
            return await this.paymenthMethodService.findByName(name);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() paymenthMethod:CreatePaymenthMethodDto):Promise<PaymenthMethodEntity>{
        try {
            return await this.paymenthMethodService.create(paymenthMethod);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() paymenthMethod:CreatePaymenthMethodDto):Promise<PaymenthMethodEntity>{
        try {
            return await this.paymenthMethodService.update(id,paymenthMethod);
        } catch (error) {
            throw error;
        }
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.paymenthMethodService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
