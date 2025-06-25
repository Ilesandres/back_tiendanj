import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SpiceService } from './spice.service';
import { CreateSpiceDto } from './dto/create.spice.dto';
import { SpiceEntity } from './entity/spice.entity';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('spice')
export class SpiceController {
    constructor(
        private readonly spiceService:SpiceService,
    ){}

    @Post("create")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() spice:CreateSpiceDto):Promise<SpiceEntity>{
        return await this.spiceService.create(spice);
    }

    @Get("all")
    async findAll():Promise<SpiceEntity[]>{
        return await this.spiceService.findAll();
    }

    @Get("id/:id")
    async findById(@Param("id") id:number):Promise<SpiceEntity>{
        return await this.spiceService.findById(id);
    }

    @Get("name/:name")
    async findByName(@Param("name") name:string):Promise<SpiceEntity[]>{
        return await this.spiceService.findByName(name);
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() spice:CreateSpiceDto):Promise<SpiceEntity>{
        return await this.spiceService.update(id,spice);
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        return await this.spiceService.delete(id);
    }
}
