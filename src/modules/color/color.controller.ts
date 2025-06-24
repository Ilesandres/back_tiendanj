import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create.color.dto';
import { ColorEntity } from './entity/color.entity';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { MessageDto } from 'src/common/message.dto';

@Controller('color')
export class ColorController {
    constructor(
        private readonly colorService:ColorService
    ){}

    @Post("create")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() color:CreateColorDto):Promise<ColorEntity>{
        return await this.colorService.create(color);
    }

    @Get("all")
    async findAll():Promise<ColorEntity[]>{
        return await this.colorService.findAll();
    }

    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<ColorEntity>{
        return await this.colorService.findById(id);
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() color:CreateColorDto):Promise<ColorEntity>{
        return await this.colorService.update(id,color);
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin",)
    async delete(@Param("id") id:number):Promise<MessageDto>{
        return await this.colorService.delete(id);
    }

    @Get("name/:name")
    async findByName(@Param("name") name:string):Promise<ColorEntity[]>{
        return await this.colorService.findByName(name);
    }
}
