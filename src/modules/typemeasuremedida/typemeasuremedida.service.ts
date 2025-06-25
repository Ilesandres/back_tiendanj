import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeMeasureEntity } from './entity/typemeasure.entity';
import { Not, Repository } from 'typeorm';
import { CreateTypeMeasureDto } from './dto/create.typemeasure.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class TypemeasuremedidaService {
    constructor(
        @InjectRepository(TypeMeasureEntity)
        private readonly typeMeasureRepository:Repository<TypeMeasureEntity>,
    ){}

    async create(typeMeasure:CreateTypeMeasureDto):Promise<TypeMeasureEntity>{
        try {
            if(!typeMeasure)throw new BadRequestException({message:"la medida es requerida"});
            typeMeasure.measure=typeMeasure.measure.toLowerCase();
            const typeMeasureExist=await this.typeMeasureRepository.findOne(
                {
                    where:{
                        measure:typeMeasure.measure,
                    }
                });
            if(typeMeasureExist)throw new BadRequestException({message:"la medida ya existe"});
            const newTypeMeasure=this.typeMeasureRepository.create(typeMeasure);
            return await this.typeMeasureRepository.save(newTypeMeasure);
        } catch (error) {
            throw error;
        }
    }

    async findAll():Promise<TypeMeasureEntity[]>{
        try {
            const typeMeasures=await this.typeMeasureRepository.find();
            if(typeMeasures.length===0)throw new NotFoundException({message:"no hay medidas"});
            return typeMeasures;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<TypeMeasureEntity>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const typeMeasure=await this.typeMeasureRepository.findOne({where:{id}});
            if(!typeMeasure)throw new NotFoundException({message:"la medida no existe"});
            return typeMeasure;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<TypeMeasureEntity[]>{
        try {
            if(!name)throw new BadRequestException({message:"el nombre es requerido"});
            const typeMeasures=await this.typeMeasureRepository.find({where:{measure:name}});
            if(typeMeasures.length===0)throw new NotFoundException({message:"no hay medidas con ese nombre"});
            return typeMeasures;
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,typeMeasure:CreateTypeMeasureDto):Promise<TypeMeasureEntity>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            if(!typeMeasure)throw new BadRequestException({message:"la medida es requerida"});
            const typeMeasureBd=await this.findById(id);
            typeMeasure.measure=typeMeasure.measure.toLowerCase();
            const typeMeasureExist=await this.typeMeasureRepository.findOne({
                where:{
                    measure:typeMeasure.measure,
                    id:Not(id)
                }
            });
            if(typeMeasureExist)throw new BadRequestException({message:"la medida ya existe"});
            typeMeasureBd.measure=typeMeasure.measure;
            const updatedTypeMeasure=await this.typeMeasureRepository.save(typeMeasureBd);
            return updatedTypeMeasure;
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const typeMeasure=await this.findById(id);
            await this.typeMeasureRepository.delete(id);
            return new MessageDto("la medida se elimino correctamente");
        } catch (error) {
            throw error;
        }
    }
    
}
