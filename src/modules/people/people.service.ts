import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleEntity } from './entity/people.entity';
import { CreatePeopleDto } from './dto/create.people.dto';
import { updatedPeopleDto } from './dto/update.people.dto';

@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(PeopleEntity)
        private readonly peopleRepository: Repository<PeopleEntity>,
    ){}

    async findAll():Promise<PeopleEntity[]>{
        try {
            const peoples= await this.peopleRepository.find();
            if(peoples.length===0){
                throw new NotFoundException({message:"no se encontraron personas"})
            }
            return peoples;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<PeopleEntity>{
        try {
            const people= await this.peopleRepository.findOne({where:{id}});
            if(!people){
                throw new NotFoundException({message:"persona no encontrada"})
            }
            return people;
        } catch (error) {
            throw error;
        }
    }

    async create(people:CreatePeopleDto):Promise<PeopleEntity>{
        try {
            const exists= await this.peopleRepository.findOne({where:{dni:people.dni}});
            if(exists){
                throw new BadRequestException({message:"la persona ya existe"})
            };
            const newPeople= this.peopleRepository.create(people);
            const savedPeople= await this.peopleRepository.save(newPeople);
            return savedPeople;
        } catch (error) {
            throw error;
        }
    }
    
    async update(id:number, people:updatedPeopleDto):Promise<PeopleEntity>{
        try {
            const exists=await this.peopleRepository.findOne({where:{id}});
            if(!exists){
                throw new NotFoundException({message:"persona no encontrada"})
            }
            if(people.name){
                exists.name=people.name;
            }
            if(people.lastname){
                exists.lastname=people.lastname;
            }
            if(people.phone){
                exists.phone=people.phone;
            }
            if(people.birthdate){
                exists.birthdate=people.birthdate;
            }
            if(people.email){
                exists.email=people.email;
            }
            if(people.typeDni){
                exists.typeDni=people.typeDni;
            }
            if(people.dni){
                exists.dni=people.dni;
            }
            const savedPeople= await this.peopleRepository.save(exists);
            return savedPeople;
        } catch (error) {
            throw error;
        }
    }
    async delete(id:number):Promise<void>{
        try {
            const exists=await this.peopleRepository.findOne({where:{id}});
            if(!exists){
                throw new NotFoundException({message:"persona no encontrada"})
            }
            await this.peopleRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
    async findByDniAndEmail(dni:string,email:string):Promise<any>{
        try {
            const people= await this.peopleRepository.findOne({where:{dni,email}});
            return people;
        } catch (error) {
            throw error;
        }
    }

    async findByDni(dni:string):Promise<PeopleEntity>{
        try {
            const people= await this.peopleRepository.findOne({where:{dni}});
            if(!people){
                throw new NotFoundException({message:"persona no encontrada"})
            }
            return people;
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email:string):Promise<PeopleEntity>{
        try {
            const people= await this.peopleRepository.findOne({where:{email}});
            if(!people){
                throw new NotFoundException({message:"persona no encontrada"})
            }
            return people;
        } catch (error) {
            throw error;
        }
    }

}
