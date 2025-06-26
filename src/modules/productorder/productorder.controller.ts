import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductorderService } from './productorder.service';
import { CreateProductOrderDto } from './dto/create.product.order.dto';
import { ProductOrderEntity } from './entity/productorder.entity';
import { UpdateProductOrderDto } from './dto/update.produc.order.dto';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('productorder')
export class ProductorderController {
    constructor(
        private readonly productOrderService:ProductorderService,
    ){}

    @Post("add-product-to-order")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "seller")
    async addProductToOrder(@Body() productOrderDto:CreateProductOrderDto):Promise<ProductOrderEntity>{
        try {
            return await this.productOrderService.addProductToOrder(productOrderDto);
        } catch (error) {
            throw error;
        }
    }

    @Get("find-by-order-id/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "seller")
    async findByOrderId(@Param("id") id:number):Promise<ProductOrderEntity[]>{
        try {
            return await this.productOrderService.finByOrderId(id);
        } catch (error) {
            throw error;
        }
    }

    @Post("update-product-from-order/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "seller")
    async updateProductFromOrder(@Param("id") id:number, @Body() productOrderDto:UpdateProductOrderDto):Promise<ProductOrderEntity>{
        try {
            return await this.productOrderService.updateProductFromOrder(id, productOrderDto);
        } catch (error) {
            throw error;
        }
    }

    @Delete("delete-product-from-order/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "seller")
    async deleteProductFromOrder(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.productOrderService.deleteProductFromOrder(id);
        } catch (error) {
            throw error;
        }
    }
}
