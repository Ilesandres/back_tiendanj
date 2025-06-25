import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StatusshipmentService } from './statusshipment.service';
import { StatusShipmentEntity } from './entity/statusshipment.entity';
import { CreateStatusShipmentDto } from './dto/create.statusshipment.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('statusshipment')
export class StatusshipmentController {
    constructor(
        private readonly statusShipmentService:StatusshipmentService
    ){}

    @Get("all")
    async findAll():Promise<StatusShipmentEntity[]>{
        try {
            return await this.statusShipmentService.findAll();
        } catch (error) {
            throw error;
        }
        
    }

    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<StatusShipmentEntity>{
        try {
            return await this.statusShipmentService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("name/:name")
    async findByName(@Param("name") name:string):Promise<StatusShipmentEntity>{
        try {
            return await this.statusShipmentService.findByName(name);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() statusShipment:CreateStatusShipmentDto):Promise<StatusShipmentEntity>{
        try {
            return await this.statusShipmentService.create(statusShipment);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() statusShipment:CreateStatusShipmentDto):Promise<StatusShipmentEntity>{
        try {
            return await this.statusShipmentService.update(id,statusShipment);
        } catch (error) {
            throw error;
        }
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.statusShipmentService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
