import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { UpdateOrderDto } from './dto/update.order.dto';
import { UserEntity } from '../user/entity/user.entity';
import { MessageDto } from 'src/common/message.dto';
import { ProductorderService } from '../productorder/productorder.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        private readonly paymentService: PaymentService,
        private readonly paymentStatusService: PaymentstatusService,
        private readonly paymenthMethodService: PaymenthmethodService,
        private readonly typeOrderService: TypeorderService,
        private readonly statusShipmentService: StatusshipmentService,
        private readonly shipmentService: ShipmentService,
        @Inject(forwardRef(()=>ProductorderService))
        private readonly productOrderService: ProductorderService
    ) { }

    async findAll(): Promise<OrderEntity[]> {
        try {
            const orders = await this.orderRepository.find({
                relations: {
                    payment: {
                        method: true,
                        status: true,
                        vouchers: true
                    },
                    productOrder: {
                        product: true,
                    },
                    user: {
                        people: {
                            typeDni: true,
                        }
                    },
                    shipment: {
                        status: true
                    },
                    typeOrder:true
                }
            });
            if (orders.length === 0) throw new NotFoundException("no se encontraron ordenes");
            return orders;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<OrderEntity> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            const order = await this.orderRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    payment: {
                        method: true,
                        status: true,
                        vouchers: true
                    },
                    productOrder: {
                        product: {
                            product:{
                                category:true
                            }
                        },
                    },
                    user: {
                        people: {
                            typeDni: true,
                        }
                    },
                    shipment: {
                        status: true
                    },
                    typeOrder:true
                }
            });
            if (!order) throw new NotFoundException("no se encontró la orden");
            if (order.user) {
                const { password, ...userWithoutPassword } = order.user;
                order.user = userWithoutPassword as UserEntity;
            }
            return order;
        } catch (error) {
            throw error;
        }
    }

    async create(orderDto: CreateOrderDto): Promise<OrderEntity> {
        try {
            if (!orderDto) throw new BadRequestException("la orden es requerida");

            let payment: any;
            if (!orderDto.payment) {
                const paymentStatus = await this.paymentStatusService.findByName("pendiente");
                if (!paymentStatus) throw new NotFoundException("no se encontró el estado de pago");
                const paymenthmethod = await this.paymenthMethodService.findByName("ninguno");
                if (!paymenthmethod) throw new NotFoundException("no se encontró el metodo de pago");
                payment = await this.paymentService.create({
                    status: paymentStatus,
                    method: paymenthmethod,
                });
            } else {
                const paymentStatusExists = await this.paymentStatusService.findById(orderDto.payment.status.id);
                if (!paymentStatusExists) throw new NotFoundException("no se encontró el estado de pago");
                const paymenthmethodExists = await this.paymenthMethodService.findById(orderDto.payment.method.id);
                if (!paymenthmethodExists) throw new NotFoundException("no se encontró el metodo de pago");
                payment = await this.paymentService.create({
                    status: paymentStatusExists,
                    method: paymenthmethodExists,
                });
            }

            let typeOrder: any;
            if (orderDto.typeOrder) {
                const typeOrderExists = await this.typeOrderService.findById(orderDto.typeOrder.id);
                if (!typeOrderExists) throw new NotFoundException("no se encontró el tipo de orden");
                typeOrder = typeOrderExists;
            } else {
                typeOrder = await this.typeOrderService.findByName("venta");
            }

            const orderToSave = this.orderRepository.create({
                ...orderDto,
                payment,
                typeOrder,
            });
            const orderSaved = await this.orderRepository.save(orderToSave);
            if(orderDto.productOrder){
                orderDto.productOrder.forEach(async(productOrder)=>{
                    productOrder.order=orderSaved;
                    await this.productOrderService.addProductToOrder(productOrder)
                })
            }

            let shipment: any;
            if (orderDto.shipment) {
                let statusShipment = orderDto.shipment.status;
                if (orderDto.shipment.status && orderDto.shipment.status.status) {
                    statusShipment = await this.statusShipmentService.findByName(orderDto.shipment.status.status);
                } else if (orderDto.shipment.status && orderDto.shipment.status.id) {
                    statusShipment = await this.statusShipmentService.findById(orderDto.shipment.status.id);
                } else {
                    statusShipment = await this.statusShipmentService.findByName("pendiente");
                }
                shipment = await this.shipmentService.create({
                    order: orderSaved,
                    status: statusShipment,
                    details: orderDto.shipment.details || ""
                });

                orderSaved.shipment = shipment;
                await this.orderRepository.save(orderSaved);
            }



            return await this.findById(orderSaved.id);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, orderDto: UpdateOrderDto): Promise<OrderEntity> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            if (!orderDto) throw new BadRequestException("la orden es requerida");
            const order = await this.findById(id);
            if (!order) throw new NotFoundException("no se encontró la orden");
            if (orderDto.payment) {
                const payment = await this.paymentService.update(order.payment.id, orderDto.payment);
            }
            if (orderDto.typeOrder) {
                const typeOrder = await this.typeOrderService.findById(orderDto.typeOrder.id);
                if (!typeOrder) throw new NotFoundException("no se encontró el tipo de orden");
                order.typeOrder = typeOrder;
            }
            if (orderDto.shipment) {
                const shipment = await this.shipmentService.update(order.shipment.id, orderDto.shipment);
                order.shipment = shipment;
            }
            await this.orderRepository.save(order);
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updateTotal(id: number, total: number, data?:string): Promise<OrderEntity> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            if (!total) throw new BadRequestException("el total es requerido");
            const order = await this.findById(id);
            if (!order) throw new NotFoundException("no se encontró la orden");
            order.total = total.toString();
            if(data){
                order.invoice=data;
            }
            await this.orderRepository.save(order);
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async orderByUserId(userId: number): Promise<OrderEntity[]> {
        try {
            if (!userId) throw new BadRequestException("el id de usuario es requerido");
            const orders = await this.orderRepository.find({
                where: {
                    user: {
                        id: userId
                    }
                },
                relations: {
                    payment: {
                        method: true,
                        status: true,
                        vouchers: true
                    },
                    productOrder: {
                        product: true,
                    },
                    user: {
                        people: {
                            typeDni: true,
                        }
                    },
                    shipment: {
                        status: true
                    },
                    typeOrder:true
                }
            });
            if (orders.length === 0) throw new NotFoundException("no se encontraron ordenes");
            orders.forEach(order => {
                if (order.user) {
                    const { password, ...userWithoutPassword } = order.user;
                    order.user = userWithoutPassword as UserEntity;
                }
            })
            return orders;
        } catch (error) {
            throw error;
        }
    }

    async orderByUserDni(dni: string): Promise<OrderEntity[]> {
        try {
            if (!dni) throw new BadRequestException("el dni es requerido");
            const orders = await this.orderRepository.find({
                where: {
                    user: {
                        people: {
                            dni: dni
                        }
                    }
                },
                relations: {
                    payment: {
                        method: true,
                        status: true,
                        vouchers: true
                    },
                    productOrder: {
                        product: true,
                    },
                    user: {
                        people: {
                            typeDni: true,
                        }
                    },
                    shipment: {
                        status: true
                    }
                }
            });
            if (orders.length === 0) throw new NotFoundException("no se encontraron ordenes");
            orders.forEach(order => {
                if (order.user) {
                    const { password, ...userWithoutPassword } = order.user;
                    order.user = userWithoutPassword as UserEntity;
                }
            })
            return orders;
        } catch (error) {
            throw error;
        }
    }

    async orderByShipmentId(shipmentId: number): Promise<OrderEntity> {
        try {
            if (!shipmentId) throw new BadRequestException("el id de envio es requerido");
            const orders = await this.orderRepository.findOne({
                where: {
                    shipment: {
                        id: shipmentId
                    }
                },
                relations: {
                    payment: {
                        method: true,
                        status: true,
                        vouchers: true
                    },
                    productOrder: {
                        product: true,
                    },
                    user: {
                        people: {
                            typeDni: true,
                        }
                    },
                    typeOrder:true
                }
            });
            if (!orders) throw new NotFoundException("no se encontró la orden");
            if (orders.user) {
                const { password, ...userWithoutPassword } = orders.user;
                orders.user = userWithoutPassword as UserEntity;
            }
            return orders;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<MessageDto> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            const order = await this.findById(id);
            if (!order) throw new NotFoundException("no se encontró la orden");
            await this.orderRepository.delete(id);
            return new MessageDto("orden eliminada correctamente");
        } catch (error) {
            throw error;
        }
    }

}
