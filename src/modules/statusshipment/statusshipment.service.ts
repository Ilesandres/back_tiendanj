import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusShipmentEntity } from './entity/statusshipment.entity';
import { Not, Repository } from 'typeorm';
import { CreateStatusShipmentDto } from './dto/create.statusshipment.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class StatusshipmentService {
    constructor(
        @InjectRepository(StatusShipmentEntity)
        private readonly statusShipmentRepository:Repository<StatusShipmentEntity>
    ){}

    async findAll():Promise<StatusShipmentEntity[]>{
        try {
            const statusShipments = await this.statusShipmentRepository.find();
            if(statusShipments.length === 0) throw new NotFoundException("no se encontraron estados de envío");
            return statusShipments;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<StatusShipmentEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const statusShipment = await this.statusShipmentRepository.findOne({
                where:{id:id}
            });
            if(!statusShipment) throw new NotFoundException("no se encontró el estado de envío");
            return statusShipment;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<StatusShipmentEntity>{
        try {
            if(!name) throw new BadRequestException("el nombre es requerido");
            const statusShipment = await this.statusShipmentRepository.findOne({
                where:{
                    status:name
                }
            });
            if(!statusShipment) throw new NotFoundException("no se encontró el estado de envío");
            return statusShipment;
        } catch (error) {
            throw error;
        }
    }

    async create(statusShipment:CreateStatusShipmentDto):Promise<StatusShipmentEntity>{
        try {
            if(!statusShipment) throw new BadRequestException("el estado de envío es requerido");
            const statusShipmentSaved = await this.statusShipmentRepository.create(statusShipment);
            return await this.statusShipmentRepository.save(statusShipmentSaved);
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,statusShipment:CreateStatusShipmentDto):Promise<StatusShipmentEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            if(!statusShipment) throw new BadRequestException("el estado de envío es requerido");
            const statusShipmentBd= await this.findById(id);
            statusShipment.status = (statusShipment.status.toLowerCase()).trim();
            const statusShipmentExists = await this.statusShipmentRepository.findOne({
                where:{
                    status:statusShipment.status,
                    id:Not(id)
                }
            });
            if(statusShipmentExists) throw new BadRequestException("el estado de envío ya existe");
            statusShipmentBd.status = statusShipment.status;
            return await this.statusShipmentRepository.save(statusShipmentBd);
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const statusShipmentBd = await this.findById(id);
            if(!statusShipmentBd) throw new NotFoundException("no se encontró el estado de envío");
            await this.statusShipmentRepository.delete(id);
            return new MessageDto("estado de envío eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }
}
