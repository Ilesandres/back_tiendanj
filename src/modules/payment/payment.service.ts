import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { UpdatePaymentDto } from './dto/update.payment.dto';
import { PaymenthmethodService } from '../paymenthmethod/paymenthmethod.service';
import { PaymentstatusService } from '../paymentstatus/paymentstatus.service';
import { CreatePaymentDto } from './dto/create.payment.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentRepository:Repository<PaymentEntity>,
        @Inject(forwardRef(()=>PaymenthmethodService))
        private readonly paymenthMethodService:PaymenthmethodService,
        private readonly paymentStatusService:PaymentstatusService,
    ){}

    async findAll():Promise<PaymentEntity[]>{
        try {
            const payments = await this.paymentRepository.find({
                relations:{
                    method:true,
                    status:true
                }
            });
            if(payments.length === 0) throw new NotFoundException("no se encontraron pagos");
            return payments;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<PaymentEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const payment = await this.paymentRepository.findOne({
                where:{
                    id:id
                },
                relations:{
                    method:true,
                    status:true
                }
            });
            if(!payment) throw new NotFoundException("no se encontró el pago");
            return payment;
        } catch (error) {
            throw error;
        }
    }

    async update(id:number, payment:UpdatePaymentDto):Promise<PaymentEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            if(!payment) throw new BadRequestException("el metodo de pago o el estado de pago son requeridos");
            const paymentExist= await this.paymentRepository.findOne({
                where:{
                    id:id
                },
                relations:{
                    method:true,
                    status:true
                }
            });
            if(!paymentExist) throw new NotFoundException("no se encontró el pago");
            if(payment.method){
                const methodExist = await this.paymenthMethodService.findById(payment.method.id);
                if(!methodExist) throw new NotFoundException("no se encontró el metodo de pago");
                paymentExist.method = methodExist;
            }
            if(payment.status){
                const statusExist = await this.paymentStatusService.findById(payment.status.id);
                if(!statusExist) throw new NotFoundException("no se encontró el estado de pago");
                paymentExist.status = statusExist;
            }
            return await this.paymentRepository.save(paymentExist);
        } catch (error) {
            throw error;
        }
    }

    async findByOrderId(orderId:number):Promise<PaymentEntity>{
        try {
            if(!orderId) throw new BadRequestException("el id de la orden es requerido");
            const payment = await this.paymentRepository.findOne({
                where:{
                    order:{
                        id:orderId
                    }
                },
                relations:{
                    method:true,
                    status:true
                }
            });
            if(!payment) throw new NotFoundException("no se encontró el pago");
            return payment;
        } catch (error) {
            throw error;
        }
    }

    async create(payment:CreatePaymentDto):Promise<PaymentEntity>{
        try {
            if(!payment) throw new BadRequestException("el metodo de pago o el estado de pago son requeridos");
            const paymentSaved= await this.paymentRepository.create(payment);
            return await this.paymentRepository.save(paymentSaved);
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const paymentExist = await this.paymentRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!paymentExist) throw new NotFoundException("no se encontró el pago");
            await this.paymentRepository.delete(id);
            return new MessageDto("pago eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }
}
