import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create.category.dto';
import { MessageDto } from 'src/common/message.dto';
import { updateCategoryDto } from './dto/update.category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository:Repository<CategoryEntity>,
    ){}

    async create(category:CreateCategoryDto):Promise<CategoryEntity>{
        try {
            if(!category)throw new BadRequestException({message:"la categoria es requerida"});
            category.category=category.category.toLowerCase();
            const categoryExist=await this.categoryRepository.findOne({where:{category:category.category}});
            if(categoryExist)throw new BadRequestException({message:"la categoria ya existe"});
            const newCategory=this.categoryRepository.create(category);
            return await this.categoryRepository.save(newCategory);
        } catch (error) {
            throw error;
        }
    }

    async findAll():Promise<CategoryEntity[]>{
        try {
            const categories=await this.categoryRepository.find();
            if(!categories)throw new NotFoundException({message:"no se encontraron categorias"});
            if(categories.length==0){
                throw new NotFoundException({message:"no se econtraron categorias"});
            }
            return categories;
        } catch (error) {
            throw error;
        }
    }

    async disable(id:number):Promise<MessageDto>{
        try {
            const categoryExist=await this.categoryRepository.findOne({where:{id}});
            if(!categoryExist)throw new NotFoundException({message:"la categoria no existe"});
            categoryExist.active=false;
            await this.categoryRepository.save(categoryExist);
            return new MessageDto("categoria desactivada correctamente");
        } catch (error) {
            throw error;
        }
    }

    async enable(id:number):Promise<MessageDto>{
        try {
            const categoryExist=await this.categoryRepository.findOne({where:{id}});
            if(!categoryExist)throw new NotFoundException({message:"la categoria no existe"});
            categoryExist.active=true;
            await this.categoryRepository.save(categoryExist);
            return new MessageDto("categoria activada correctamente");
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<CategoryEntity>{
        try {
            const categoryExist=await this.categoryRepository.findOne({where:{id}});
            if(!categoryExist)throw new NotFoundException({message:"la categoria no existe"});
            return categoryExist;
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,category:updateCategoryDto):Promise<MessageDto>{
        try {
            const categoryExist=await this.categoryRepository.findOne({where:{id}});
            if(!categoryExist)throw new NotFoundException({message:"la categoria no existe"});
            if(category.category)categoryExist.category=category.category.toLowerCase();
            const categoryNameExist=await this.categoryRepository.findOne({where:{category:category.category}});
            if(categoryNameExist)throw new BadRequestException({message:"la categoria ya existe"});
            await this.categoryRepository.save(categoryExist);
            return new MessageDto("categoria actualizada correctamente");
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<CategoryEntity>{
        try {
            const categoryExist=await this.categoryRepository.findOne({where:{category:name}});
            if(!categoryExist)throw new NotFoundException({message:"la categoria no existe"});
            return categoryExist;
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            const categoryExist=await this.categoryRepository.findOne({where:{id}});
            if(!categoryExist)throw new NotFoundException({message:"la categoria no existe"});
            await this.categoryRepository.delete(id);
            return new MessageDto("categoria eliminada correctamente");
        } catch (error) {
            throw error;
        }
    }
}
