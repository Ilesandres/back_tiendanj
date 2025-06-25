import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentRepository:Repository<PaymentEntity>
    ){}

    async findAll():Promise<PaymentEntity[]>{
        try {
            const payments = await this.paymentRepository.find();
            if(payments.length === 0) throw new NotFoundException("no se encontraron pagos");
            return payments;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<PaymentEntity>{
        try {
            const payment = await this.paymentRepository.findOne({where:{id:id}});
            if(!payment) throw new NotFoundException("no se encontró el pago");
            return payment;
        } catch (error) {
            throw error;
        }
    }
}
