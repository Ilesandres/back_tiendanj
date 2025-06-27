import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { VariationproductService } from './variationproduct.service';
import { CreateVariationProductDto } from './dto/create.varitionproduct.dto';
import { VariationProductEntity } from './entity/variationproduct.entity';
import { MessageDto } from 'src/common/message.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UpdateVariationProductDto } from './dto/update.variationproduct.dto';

@Controller('variationproduct')
export class VariationproductController {
    constructor(
        private readonly variationProductService:VariationproductService,
    ){}

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "vendedor")
    async create(@Body()product:CreateVariationProductDto):Promise<VariationProductEntity>{
        try {
            return await this.variationProductService.create(product);
        } catch (error) {
            throw error;
        }
    };

    @Get("all")
    async findAll():Promise<VariationProductEntity[]>{
        try {
            return await this.variationProductService.findAll();
        } catch (error) {
            throw error;
        }
    };

    @Get("findbyid/:id")
    async findById(@Param("id") id:number):Promise<VariationProductEntity>{
        try {
            return await this.variationProductService.findById(id);
        } catch (error) {
            throw error;
        }
    };

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "vendedor")
    async update(@Param("id") id:number,@Body()product:UpdateVariationProductDto):Promise<VariationProductEntity>{
        try {
            return await this.variationProductService.update(id,product);
        } catch (error) {
            throw error;
        }
    };

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.variationProductService.delete(id);
        } catch (error) {
            throw error;
        }
    };

    @Patch("change-status/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async changeStatus(@Param("id") id:number):Promise<VariationProductEntity>{
        try {
            return await this.variationProductService.changeStatus(id);
        } catch (error) {
            throw error;
        }
    };

    @Post("change-stock/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async changeStock(@Param("id") id:number,@Body()body:{stock:number}):Promise<VariationProductEntity>{
        try {
            return await this.variationProductService.changeStock(id,body.stock);
        } catch (error) {
            throw error;
        }
    };

    @Get("findbyproductid/:id")
    async findByProductId(@Param("id") id:number):Promise<VariationProductEntity[]>{
        try {
            return await this.variationProductService.findByProductId(id);
        } catch (error) {
            throw error;
        }
    };
}
