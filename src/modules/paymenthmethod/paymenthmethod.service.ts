import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymenthMethodEntity } from './entity/paymenthMethod.entity';
import { Not, Repository } from 'typeorm';
import { CreatePaymenthMethodDto } from './dto/create.paymenthmethon.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class PaymenthmethodService {
    constructor(
        @InjectRepository(PaymenthMethodEntity)
        private readonly paymenthMethodRepository:Repository<PaymenthMethodEntity>
    ){}

    async findAll():Promise<PaymenthMethodEntity[]>{
        try {
            const paymenthMethod = await this.paymenthMethodRepository.find();
            if(paymenthMethod.length ===0) throw new NotFoundException("no se encontraron metodos de pago");
            return paymenthMethod;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<PaymenthMethodEntity>{
        try {
            const paymenthMethod = await this.paymenthMethodRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!paymenthMethod) throw new NotFoundException("no se encontró el metodo de pago");
            return paymenthMethod;
        } catch (error) {
            throw error;
        }
    }
    
    async create(paymenthMethod:CreatePaymenthMethodDto):Promise<PaymenthMethodEntity>{
        try {
            if(!paymenthMethod) throw new BadRequestException("el metodo de pago es requerido");
            if(!paymenthMethod.method) throw new BadRequestException("el nombre es requerido");
            paymenthMethod.method = (paymenthMethod.method.toLowerCase()).trim();
            const paymenthMethodExist = await this.paymenthMethodRepository.findOne({
                where:{
                    method:paymenthMethod.method
                }
            });
            if(paymenthMethodExist) throw new BadRequestException("el metodo de pago ya existe");
            const newPaymenthMethod = this.paymenthMethodRepository.create(paymenthMethod);
            return await this.paymenthMethodRepository.save(newPaymenthMethod);
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,paymenthMethod:CreatePaymenthMethodDto):Promise<PaymenthMethodEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            if(!paymenthMethod) throw new BadRequestException("el metodo de pago es requerido");
            if(!paymenthMethod.method) throw new BadRequestException("el nombre es requerido");
            const paymenthMethodBd = await this.paymenthMethodRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!paymenthMethodBd) throw new NotFoundException("no se encontró el metodo de pago");
            paymenthMethod.method = (paymenthMethod.method.toLowerCase()).trim();
            const paymenthMethodExist = await this.paymenthMethodRepository.findOne({
                where:{
                    method:paymenthMethod.method,
                    id:Not(id)
                }
            });
            if(paymenthMethodExist) throw new BadRequestException("el metodo de pago ya existe");
            paymenthMethodBd.method = paymenthMethod.method;
            return await this.paymenthMethodRepository.save(paymenthMethodBd);
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<PaymenthMethodEntity>{
        try {
            if(!name) throw new BadRequestException("el nombre es requerido");
            name = (name.toLowerCase()).trim();
            const paymenthMethod = await this.paymenthMethodRepository.findOne({
                where:{
                    method:name
                }
            });
            if(!paymenthMethod) throw new NotFoundException("no se encontró el metodo de pago");
            return paymenthMethod;
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const paymenthMethod = await this.paymenthMethodRepository.findOne({
                where:{
                    id
                }
            });
            if(!paymenthMethod) throw new NotFoundException("no se encontró el metodo de pago");
            await this.paymenthMethodRepository.delete(id);
            return new MessageDto("metodo de pago eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }
}
