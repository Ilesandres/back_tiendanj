import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TypeorderService } from './typeorder.service';
import { TypeOrderEntity } from './entity/type.order.entity';
import { CreateTypeOrderDto } from './dto/create.typeorder.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('typeorder')
export class TypeorderController {
    constructor(
        private readonly typeOrderService:TypeorderService,
    ){}

    @Get("all")
    async findAll():Promise<TypeOrderEntity[]>{
        try {
            return await this.typeOrderService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<TypeOrderEntity>{
        try {
            return await this.typeOrderService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() typeOrder:CreateTypeOrderDto):Promise<TypeOrderEntity>{
        try {
            return await this.typeOrderService.create(typeOrder);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() typeOrder:CreateTypeOrderDto):Promise<TypeOrderEntity>{
        try {
            return await this.typeOrderService.update(id,typeOrder);
        } catch (error) {
            throw error;
        }
    }

    @Get("name/:name")
    async findByName(@Param("name") name:string):Promise<TypeOrderEntity>{
        try {
            return await this.typeOrderService.findByName(name);
        } catch (error) {
            throw error;
        }
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.typeOrderService.delete(id);
        } catch (error) {
            throw error;
        }
    }


}
