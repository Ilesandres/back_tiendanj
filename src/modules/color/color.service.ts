import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorEntity } from './entity/color.entity';
import { Not, Repository } from 'typeorm';
import { CreateColorDto } from './dto/create.color.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class ColorService {
    constructor(
        @InjectRepository(ColorEntity)
        private readonly colorRepository:Repository<ColorEntity>
    ){}

    async create(color:CreateColorDto):Promise<ColorEntity>{
        try {
            if(!color)throw new BadRequestException({message:"el color es requerido"});
            color.color=color.color.toLowerCase();
            const colorExist=await this.colorRepository.findOne({where:{color:color.color}});
            if(colorExist)throw new BadRequestException({message:"el color ya existe"});
            const newColor=this.colorRepository.create(color);
            return await this.colorRepository.save(newColor);
        } catch (error) {
            throw error;
        }
    }

    async findAll():Promise<ColorEntity[]>{
        try {
            return await this.colorRepository.find();
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<ColorEntity>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const color=await this.colorRepository.findOne({where:{id}});
            if(!color)throw new NotFoundException({message:"el color no existe"});
            return color;
        } catch (error) {
            throw error;
        }
    }
    
    async update(id:number,color:CreateColorDto):Promise<ColorEntity>{
        try {
            if(!color)throw new BadRequestException({message:"el color es requerido"});
            const colorExist=await this.findById(id);
            if(!colorExist)throw new NotFoundException({message:"el color no existe"});
            colorExist.color=color.color.toLowerCase();
            const existNewColor=await this.colorRepository.findOne({
                where:{
                    color:color.color,
                    id:Not(id)
                }
            })
            if(existNewColor)throw new BadRequestException({message:"el color ya existe"});
            return await this.colorRepository.save(colorExist);
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            const colorExist=await this.findById(id);
            if(!colorExist)throw new NotFoundException({message:"el color no existe"});
            await this.colorRepository.delete(id);
            return new MessageDto("color eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<ColorEntity[]>{
        try {
            if(!name)throw new BadRequestException({message:"el nombre es requerido"});
            const colors=await this.colorRepository.find({where:{color:name}});
            if(colors.length===0)throw new NotFoundException({message:"el color no existe"});
            return colors;
        } catch (error) {
            throw error;
        }
    }
}
