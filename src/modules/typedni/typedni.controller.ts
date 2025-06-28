import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TypedniService } from './typedni.service';
import { TypeDniEntity } from './entity/typedni.entity';
import { CreateTypeDni } from './dto/create.typedni.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('typedni')
export class TypedniController {
    constructor(
        private readonly typedniService:TypedniService,
    ){}

    @Get("all")
    async findAll():Promise<TypeDniEntity[]>{
        try {
            return await this.typedniService.findAll();
        } catch (error) {
            throw error;
        }
    }
    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<TypeDniEntity>{
        try {
            return await this.typedniService.findById(id);
        } catch (error) {
            throw error;
        }
    }
    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() typeDni:CreateTypeDni):Promise<TypeDniEntity>{
        try {
            return await this.typedniService.create(typeDni);
        } catch (error) {
            throw error;
        }
    }
    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() typeDni:CreateTypeDni):Promise<TypeDniEntity>{
        try {
            return await this.typedniService.update(id,typeDni);
        } catch (error) {
            throw error;
        }
    }
    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.typedniService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
