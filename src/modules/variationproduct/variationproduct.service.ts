import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariationProductEntity } from './entity/variationproduct.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CreateVariationProductDto } from './dto/create.varitionproduct.dto';

@Injectable()
export class VariationproductService {
    constructor(
        @InjectRepository(VariationProductEntity)
        private readonly variationProductRepository:Repository<VariationProductEntity>,
        private readonly productService:ProductService
    ){}

    async create(variation:CreateVariationProductDto):Promise<VariationProductEntity>{
        try {
            const productExist=await this.productService.findById(variation.product.id);
            if(!productExist)throw new NotFoundException({message:"el producto no existe"});
            const variationExist=await this.variationProductRepository.findOne({where:{spice:variation.spice,product:{id:variation.product.id}}});
            if(variationExist)throw new BadRequestException({message:"la variacion ya existe"});
            const newVariation=this.variationProductRepository.create(variation);
            return await this.variationProductRepository.save(newVariation);
        } catch (error) {
            throw error;
        }
    }
}
