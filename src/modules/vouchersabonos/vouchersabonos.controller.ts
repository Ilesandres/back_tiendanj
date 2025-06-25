import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VouchersabonosService } from './vouchersabonos.service';
import { VouchersEntity } from './entity/vouchers.entity';
import { CreateVoucherDto } from './dto/create.voucher.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('vouchersabonos')
export class VouchersabonosController {
    constructor(
        private readonly vouchersabonosService:VouchersabonosService
    ){}

    @Get("all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findAll():Promise<VouchersEntity[]>{
        try {
            return await this.vouchersabonosService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("id/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findById(@Param("id") id:number):Promise<VouchersEntity>{
        try {
            return await this.vouchersabonosService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("payment/:paymentId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findByPaymentId(@Param("paymentId") paymentId:number):Promise<VouchersEntity>{
        try {
            return await this.vouchersabonosService.findByPaymentId(paymentId);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() voucher:CreateVoucherDto):Promise<VouchersEntity>{
        try {
            return await this.vouchersabonosService.create(voucher);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number, @Body() voucher:CreateVoucherDto):Promise<VouchersEntity>{
        try {
            return await this.vouchersabonosService.update(id, voucher);
        } catch (error) {
            throw error;
        }
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.vouchersabonosService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
