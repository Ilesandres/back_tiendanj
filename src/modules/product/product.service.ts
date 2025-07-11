import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create.product.dto';
import { MessageDto } from 'src/common/message.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { CategoryService } from '../category/category.service';
import { ProductsFiltersDto } from './dto/products.filters.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly categoryService: CategoryService
    ) { }

    async create(product: CreateProductDto): Promise<ProductEntity> {
        try {
            if (!product) throw new BadRequestException({ message: "el producto es requerido" });
            product.product = product.product.toLowerCase();
            const productExist = await this.productRepository.findOne({ where: { product: product.product } });
            if (productExist) throw new BadRequestException({ message: "el producto ya existe" });
            if (product.category) {
                const categoryExist = await this.categoryService.findById(product.category.id);
                if (!categoryExist) throw new NotFoundException({ message: "la categoria no existe" });
                product.category = categoryExist;
            } else {
                const categoryDefault = await this.categoryService.findByName("ninguna");
                product.category = categoryDefault;
            }
            const newProduct = this.productRepository.create(product);
            return await this.productRepository.save(newProduct);
        } catch (error) {
            throw error
        }
    }

    async findAll(): Promise<ProductEntity[]> {
        try {
            const products = await this.productRepository.find({
                relations: {
                    category: true,
                    variation: {
                        spice: true,
                        color: true,
                    }
                }
            });
            if (!products) throw new NotFoundException({ message: "no se encontraron productos" });
            if (products.length == 0) {
                throw new NotFoundException({ message: "no se econtraron productos" });
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<MessageDto> {
        try {
            const productExist = await this.productRepository.findOne({ where: { id } });
            if (!productExist) throw new NotFoundException({ message: "el producto no existe" });
            await this.productRepository.delete(id);
            return new MessageDto("producto eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }

    async changeStatus(id: number): Promise<ProductEntity> {
        try {
            const productExist = await this.productRepository.findOne({ where: { id } });
            if (!productExist) throw new NotFoundException({ message: "el producto no existe" });
            productExist.active = !productExist.active;
            return await this.productRepository.save(productExist);
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<ProductEntity> {
        try {
            const productExist = await this.productRepository.findOne(
                {
                    where: {
                        id
                    },
                    relations: {
                        category: true,
                        variation: {
                            spice: true,
                            color: true,
                            measure: true,
                        },
                    }
                });
            if (!productExist) throw new NotFoundException({ message: "el producto no existe" });
            return productExist;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, product: UpdateProductDto): Promise<MessageDto> {
        try {
            if (!product) throw new BadRequestException({ message: "el producto es requerido" });
            const productExist = await this.productRepository.findOne({ where: { id } });
            if (!productExist) throw new NotFoundException({ message: "el producto no existe" });
            if (product.product) productExist.product = product.product.toLowerCase();
            const productNameExist = await this.productRepository.findOne(
                {
                    where: {
                        product: product.product,
                        id: Not(id)
                    }
                }
            );
            if (productNameExist) throw new BadRequestException({ message: "el nombre del producto ya existe" });
            if (product.category) {
                const categoryExist = await this.categoryService.findById(product.category.id);
                if (!categoryExist) throw new NotFoundException({ message: "la categoria no existe" });
                productExist.category = categoryExist;
            }
            await this.productRepository.save(productExist);
            return new MessageDto("producto actualizado correctamente");
        } catch (error) {
            throw error;
        }
    }

    async findByCategory(category: number): Promise<ProductEntity[]> {
        try {
            const products = await this.productRepository.find({
                where: { category: { id: category } },
                relations: {
                    category: true,
                    variation: {
                        spice: true,
                        color: true,
                    }
                }
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name: string): Promise<ProductEntity[]> {
        try {
            const products = await this.productRepository.find({
                where: { product: name },
                relations: {
                    category: true,
                    variation: {
                        spice: true,
                        color: true,
                    }
                }
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    async findByFilters(filters: ProductsFiltersDto): Promise<ProductEntity[]> {
        try {
            if(!filters) throw new BadRequestException({ message: "los filtros son requeridos" });
            const products = await this.productRepository.createQueryBuilder("product")
                .innerJoinAndSelect("product.category", "category")
                .innerJoinAndSelect("product.variation", "variation")
            if (filters.category) {
                products.andWhere("product.category = :category", { category: filters.category.id });
            }
            if (filters.name) {
                products.andWhere("product.product LIKE :name", { name: `%${filters.name}%` });
            }
            if (filters.variationActive && filters.variationActive!=null) {
                
            if(filters.variationActive=="true"){
                filters.variationActive=true;
            }else if(filters.variationActive=="false"){
                filters.variationActive=false;
            }
                products.andWhere("variation.active = :active", { active: filters.variationActive });
            }
            if (filters.active && filters.active!=null) {
                if(filters.active=="true"){
                    filters.active=true;
                }else if(filters.active=="false"){
                    filters.active=false;
                }
                products.andWhere("product.active = :active", { active: filters.active});
            }
            if (filters.minPrice) {
                products.where("variation.price >= :minPrice", { minPrice: filters.minPrice });
            }
            if (filters.maxPrice) {
                products.andWhere("variation.price <= :maxPrice", { maxPrice: filters.maxPrice });
            }
            if (filters.spice) {
                products.andWhere("variation.spice = :spice", { spice: filters.spice.id });
            }
            if (filters.measure) {
                products.andWhere("variation.measure = :measure", { measure: filters.measure.id });
            }
            return await products.getMany();
        } catch (error) {
            throw error;
        }
    }

}
