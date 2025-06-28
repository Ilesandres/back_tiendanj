import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentEntity } from './entity/shipment.entity';
import { CreateShipmentDto } from './dto/create.shipment.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('shipment')
export class ShipmentController {
    constructor(
        private readonly shipmentService:ShipmentService
    ){}

    @Get("all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findAll():Promise<ShipmentEntity[]>{
        try {
            return await this.shipmentService.findAll();
        } catch (error) {
            throw error;
        }
    }
    
    @Get("id/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findById(@Param("id") id:number):Promise<ShipmentEntity>{
        try {
            return await this.shipmentService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() shipment:CreateShipmentDto):Promise<ShipmentEntity>{
        try {
            return await this.shipmentService.create(shipment);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number, @Body() shipment:CreateShipmentDto):Promise<ShipmentEntity>{
        try {
            return await this.shipmentService.update(id, shipment);
        } catch (error) {
            throw error;
        }
    }
    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin",)
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.shipmentService.delete(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("order/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findByOrderId(@Param("id") id:number):Promise<ShipmentEntity>{
        try {
            return await this.shipmentService.findByOrderId(id);
        } catch (error) {
            throw error;
        }
    }
}
