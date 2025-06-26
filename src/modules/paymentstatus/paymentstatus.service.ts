import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatusEntity } from './entity/paymentstatus.entity';
import { Not, Repository } from 'typeorm';
import { CreatePaymentStatusDto } from './dto/create.paymentstatus.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class PaymentstatusService {
    constructor(
        @InjectRepository(PaymentStatusEntity)
        private readonly paymentStatusRepository:Repository<PaymentStatusEntity>
    ){}

    async findAll():Promise<PaymentStatusEntity[]>{
        try {
            const paymentStatus = await this.paymentStatusRepository.find();
            if(paymentStatus.length === 0) throw new NotFoundException("no se encontraron estados de pago");
            return paymentStatus;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<PaymentStatusEntity>{
        try {
            const paymentStatus = await this.paymentStatusRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!paymentStatus) throw new NotFoundException("no se encontró el estado de pago");
            return paymentStatus;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<PaymentStatusEntity>{
        try {
            if(!name) throw new BadRequestException("el nombre es requerido");
            name = (name.toLowerCase()).trim();
            const paymentStatus = await this.paymentStatusRepository.findOne({
                where:{
                    status:name
                }
            });
            if(!paymentStatus) throw new NotFoundException("no se encontró el estado de pago");
            return paymentStatus;
        } catch (error) {
            throw error;
        }
    }

    async create(paymentStatus:CreatePaymentStatusDto):Promise<PaymentStatusEntity>{
        try {
            if(!paymentStatus) throw new BadRequestException("el estado de pago es requerido");
            if(!paymentStatus.status) throw new BadRequestException("el nombre es requerido");
            paymentStatus.status = (paymentStatus.status.toLowerCase()).trim();
            const paymentStatusExist = await this.paymentStatusRepository.findOne({
                where:{
                    status:paymentStatus.status
                }
            });
            if(paymentStatusExist) throw new BadRequestException("el estado de pago ya existe");
            const newPaymentStatus = this.paymentStatusRepository.create(paymentStatus);
            return await this.paymentStatusRepository.save(newPaymentStatus);
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,paymentStatus:CreatePaymentStatusDto):Promise<PaymentStatusEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            if(!paymentStatus) throw new BadRequestException("el estado de pago es requerido");
            if(!paymentStatus.status) throw new BadRequestException("el nombre es requerido");
            paymentStatus.status = (paymentStatus.status.toLowerCase()).trim();
            const paymentStatusBd = await this.paymentStatusRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!paymentStatusBd) throw new NotFoundException("no se encontró el estado de pago");
            const paymentStatusExist = await this.paymentStatusRepository.findOne({
                where:{
                    status:paymentStatus.status,
                    id:Not(id)
                }
            });
            if(paymentStatusExist) throw new BadRequestException("el estado de pago ya existe");
            paymentStatusBd.status = paymentStatus.status;
            return await this.paymentStatusRepository.save(paymentStatusBd);
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const paymentStatus = await this.paymentStatusRepository.findOne({
                where:{
                    id
                }
            });
            if(!paymentStatus) throw new NotFoundException("no se encontró el estado de pago");
            await this.paymentStatusRepository.delete(id);
            return new MessageDto("estado de pago eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }
}
