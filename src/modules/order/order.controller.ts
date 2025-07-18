import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderEntity } from './entity/order.entity';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { MessageDto } from 'src/common/message.dto';
import { FiltersOrdersDto } from './dto/filters.orders.dto';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService:OrderService
    ){}

    @Get("all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findAll():Promise<OrderEntity[]>{
        try {
            return await this.orderService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("id/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findById(@Param("id") id:number):Promise<OrderEntity>{
        try {
            return await this.orderService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("user/id/:userId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findByUserId(@Param("userId") userId:number):Promise<OrderEntity[]>{
        try {
            return await this.orderService.orderByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    @Get("user/dni/:dni")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findByUserDni(@Param("dni") dni:string):Promise<OrderEntity[]>{
        try {
            return await this.orderService.orderByUserDni(dni);
        } catch (error) {
            throw error;
        }
    }

    @Get("shipment/id/:shipmentId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async findByShipmentId(@Param("shipmentId") shipmentId:number):Promise<OrderEntity>{
        try {
            return await this.orderService.orderByShipmentId(shipmentId);
        } catch (error) {
            throw error;
        }
    }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() orderDto:CreateOrderDto):Promise<OrderEntity>{
        try {
            return await this.orderService.create(orderDto);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number, @Body() orderDto:UpdateOrderDto):Promise<OrderEntity>{
        try {
            return await this.orderService.update(id, orderDto);
        } catch (error) {
            throw error;
        }
    }

    @Post("update/total/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async updateTotal(@Param("id") id:number, @Body() body:{total:number}):Promise<OrderEntity>{
        try {
            if(!body || !body.total || typeof body.total !== "number" || body.total <= 0) throw new BadRequestException("el total es requerido");
            return await this.orderService.updateTotal(id, body.total);
        } catch (error) {
            throw error;
        }
    }

    @Post("send/email/invoice/:orderId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async sendEmailInvoice(@Param("orderId") orderId:number):Promise<MessageDto>{
        try {
            return await this.orderService.sendEmailInvoice(orderId);
        } catch (error) {
            throw error;
        }
    }

    @Post("filters")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin","vendedor")
    async searchFilters(@Body() filters:FiltersOrdersDto):Promise<OrderEntity[]>{
        return this.orderService.searchFilters(filters);
    }
}
