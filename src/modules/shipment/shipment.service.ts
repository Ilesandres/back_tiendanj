import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentEntity } from './entity/shipment.entity';
import { Not, Repository } from 'typeorm';
import { CreateStatusShipmentDto } from '../statusshipment/dto/create.statusshipment.dto';
import { StatusshipmentService } from '../statusshipment/statusshipment.service';
import { CreateShipmentDto } from './dto/create.shipment.dto';
import { OrderService } from '../order/order.service';
import { MessageDto } from 'src/common/message.dto';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class ShipmentService {
    constructor(
        @InjectRepository(ShipmentEntity)
        private readonly shipmentRepository: Repository<ShipmentEntity>,
        @Inject(forwardRef(() => StatusshipmentService))
        private readonly statusshipmentService: StatusshipmentService,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService
    ) { }

    async findAll(): Promise<ShipmentEntity[]> {
        try {
            const shipments = await this.shipmentRepository.find({
                relations: {
                    order: {
                        user: {
                            people: {
                                typeDni: true
                            }
                        }
                    },
                    status: true
                }
            });
            if (shipments.length === 0) throw new NotFoundException("no se encontraron envíos");
            shipments.forEach(shipment => {
                if (shipment.order?.user) {
                    const { password, ...userWithoutPassword } = shipment.order.user;
                    shipment.order.user = userWithoutPassword as UserEntity;
                }
            });
            return shipments;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<ShipmentEntity> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            const shipment = await this.shipmentRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    order: {
                        user: {
                            people: {
                                typeDni: true
                            }
                        }
                    },
                    status: true
                }
            });
            if (!shipment) throw new NotFoundException("no se encontró el envío");
            if (shipment.order?.user) {
                const { password, ...userWithoutPassword } = shipment.order.user;
                shipment.order.user = userWithoutPassword as UserEntity;
            }
            return shipment;
        } catch (error) {
            throw error;
        }
    }

    async create(shipment: CreateShipmentDto): Promise<ShipmentEntity> {
        try {
            if (!shipment) throw new BadRequestException("el envío es requerido");
            const shipmentExists = await this.shipmentRepository.findOne({
                where: {
                    order: {
                        id: shipment.order.id
                    }
                }
            });
            if (shipmentExists) throw new BadRequestException("el envío para esta ordenya existe");
            const statusshipmentExist = await this.statusshipmentService.findById(shipment.status.id);
            if (!statusshipmentExist) throw new NotFoundException("no se encontró el estado de envío");
            const orderExist = await this.orderService.findById(shipment.order.id);
            if (!orderExist) throw new NotFoundException("no se encontró la orden");
            shipment.order = orderExist;
            shipment.status = statusshipmentExist;
            const shipmentSaved = await this.shipmentRepository.create(shipment);
            const shipmentSavedBd = await this.shipmentRepository.save(shipmentSaved);
            if (shipmentSavedBd.order?.user) {
                const { password, ...userWithoutPassword } = shipmentSavedBd.order.user;
                shipmentSavedBd.order.user = userWithoutPassword as UserEntity;
            }

            return shipmentSavedBd;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, shipment: CreateShipmentDto): Promise<ShipmentEntity> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            if (!shipment) throw new BadRequestException("el envío es requerido");
            const shipmentExist = await this.findById(id);
            if (!shipmentExist) throw new NotFoundException("no se encontró el envío");
            
            if (shipment.status) {
                const statusshipmentExist = await this.statusshipmentService.findById(shipment.status.id);
                if (!statusshipmentExist) throw new NotFoundException("no se encontró el estado de envío");
                shipmentExist.status = statusshipmentExist;
            }
            if (shipment.order) {
                const orderExist = await this.orderService.findById(shipment.order.id);
                if (!orderExist) throw new NotFoundException("no se encontró la orden");
                shipmentExist.order = orderExist;
            }
            const shipmentExists = await this.shipmentRepository.findOne({
                where: {
                    order: {
                        id: shipment.order.id,
                    },
                    id: Not(id)
                }
            });
            if (shipmentExist.details) shipmentExist.details = shipment.details;
            if (shipmentExists) throw new BadRequestException("el envío para esta ordenya existe");
            const shipmentSaved = await this.shipmentRepository.save(shipmentExist);
            if (shipmentSaved.order?.user) {
                const { password, ...userWithoutPassword } = shipmentSaved.order.user;
                shipmentSaved.order.user = userWithoutPassword as UserEntity;
            }
            return shipmentSaved;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<MessageDto> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            const shipmentExist = await this.findById(id);
            if (!shipmentExist) throw new NotFoundException("no se encontró el envío");
            await this.shipmentRepository.delete(id);
            return new MessageDto("envío eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }

    async findByOrderId(orderId: number): Promise<ShipmentEntity> {
        try {
            if (!orderId) throw new BadRequestException("el id de la orden es requerido");
            const shipment = await this.shipmentRepository.findOne({
                where: {
                    order: {
                        id: orderId
                    }
                },
                relations: {
                    order: {
                        user: {
                            people: {
                                typeDni: true
                            }
                        },
                    },
                    status: true
                }
            });
            if (!shipment) throw new NotFoundException("no se encontró el envío");
            if (shipment.order?.user) {
                const { password, ...userWithoutPassword } = shipment.order.user;
                shipment.order.user = userWithoutPassword as UserEntity;
            }

            return shipment;
        } catch (error) {
            throw error;
        }
    }
}
