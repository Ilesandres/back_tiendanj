import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TypemeasuremedidaService } from './typemeasuremedida.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { CreateTypeMeasureDto } from './dto/create.typemeasure.dto';
import { TypeMeasureEntity } from './entity/typemeasure.entity';
import { MessageDto } from 'src/common/message.dto';

@Controller('typemeasuremedida')
export class TypemeasuremedidaController {
    constructor(
        private readonly typeMeasureService:TypemeasuremedidaService
    ){}

    @Post("create")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() typeMeasure:CreateTypeMeasureDto):Promise<TypeMeasureEntity>{
        return await this.typeMeasureService.create(typeMeasure);
    }

    @Get("all")
    async findAll():Promise<TypeMeasureEntity[]>{
        return await this.typeMeasureService.findAll();
    }

    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<TypeMeasureEntity>{
        return await this.typeMeasureService.findById(id);
    }

    @Get("name/:name")
    async findByName(@Param("name") name:string):Promise<TypeMeasureEntity[]>{
        return await this.typeMeasureService.findByName(name);
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() typeMeasure:CreateTypeMeasureDto):Promise<TypeMeasureEntity>{
        return await this.typeMeasureService.update(id,typeMeasure);
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        return await this.typeMeasureService.delete(id);
    }

}
