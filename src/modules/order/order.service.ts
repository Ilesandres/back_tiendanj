import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { Repository } from 'typeorm';
import { PaymentService } from '../payment/payment.service';
import { PaymentstatusService } from '../paymentstatus/paymentstatus.service';
import { PaymenthmethodService } from '../paymenthmethod/paymenthmethod.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { TypeorderService } from '../typeorder/typeorder.service';
import { StatusshipmentService } from '../statusshipment/statusshipment.service';
import { ShipmentService } from '../shipment/shipment.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository:Repository<OrderEntity>,
        private readonly paymentService:PaymentService,
        private readonly paymentStatusService:PaymentstatusService,
        private readonly paymenthMethodService:PaymenthmethodService,
        private readonly typeOrderService:TypeorderService,
        private readonly statusShipmentService:StatusshipmentService,
        private readonly shipmentService:ShipmentService
    ){}

    async findAll():Promise<OrderEntity[]>{
        try {
            const orders = await this.orderRepository.find({
                relations:{
                    payment:{
                        method:true,
                        status:true,
                        vouchers:true
                    },
                    productOrder:{
                        product:true,
                    },
                    user:{
                        people:{
                            typeDni:true,
                        }
                    },
                    shipment:{
                        status:true
                    },
                }
            });
            if(orders.length === 0) throw new NotFoundException("no se encontraron ordenes");
            return orders;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<OrderEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const order = await this.orderRepository.findOne({
                where:{
                    id:id
                },
                relations:{
                    payment:{
                        method:true,
                        status:true,
                        vouchers:true
                    },
                    productOrder:{
                        product:true,
                    },
                    user:{
                        people:{
                            typeDni:true,
                        }
                    },
                    shipment:{
                        status:true
                    }
                }
            });
            if(!order) throw new NotFoundException("no se encontró la orden");
            return order;
        } catch (error) {
            throw error;
        }
    }

    async create(order:CreateOrderDto):Promise<OrderEntity>{
        try {
            if(!order) throw new BadRequestException("la orden es requerida");
            if(!order.payment){
                const paymentStatus =await this.paymentStatusService.findByName("pendiente");
                if(!paymentStatus) throw new NotFoundException("no se encontró el estado de pago");
                const paymenthmethod= await this.paymenthMethodService.findByName("ninguno");
                if(!paymenthmethod) throw new NotFoundException("no se encontró el metodo de pago");
                const payment= await this.paymentService.create({
                    status:paymentStatus,
                    method:paymenthmethod,
                });
                order.payment = payment;
            }else{
                const paymentStatusExists = await this.paymentStatusService.findById(order.payment.status.id);
                if(!paymentStatusExists) throw new NotFoundException("no se encontró el estado de pago");
                const paymenthmethodExists = await this.paymenthMethodService.findById(order.payment.method.id);
                if(!paymenthmethodExists) throw new NotFoundException("no se encontró el metodo de pago");
                const payment = await this.paymentService.update(order.payment.id, {
                    status:paymentStatusExists,
                    method:paymenthmethodExists,
                });
                order.payment = payment;
            }
            if(order.typeOrder){
                const typeOrderExists = await this.typeOrderService.findById(order.typeOrder.id);
                if(!typeOrderExists) throw new NotFoundException("no se encontró el tipo de orden");
                order.typeOrder = typeOrderExists;
            }else{
                const typeOrder= await this.typeOrderService.findByName("venta");
                order.typeOrder = typeOrder;
            }
            
            const orderSaved = await this.orderRepository.create(order);
            const orderSavedBd = await this.orderRepository.save(orderSaved);
            if(order.shipment){
                const statusshipmentExists = await this.statusShipmentService.findByName(order.shipment.status.status);
                if(!statusshipmentExists) throw new NotFoundException("no se encontró el estado de envío");
                const shipment = await this.shipmentService.create(order.shipment);
                order.shipment = shipment;
            }else{
                const statusshipment= await this.statusShipmentService.findByName("pendiente");
                const shipment = await this.shipmentService.create({
                    order:orderSavedBd,
                    status:statusshipment,
                    details:""
                });
                order.shipment = shipment;
            }

            return orderSavedBd;
        } catch (error) {
            throw error;
        }
    }
}
