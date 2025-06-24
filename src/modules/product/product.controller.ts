import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { CreateProductDto } from './dto/create.product.dto';
import { ProductEntity } from './entity/product.entity';
import { ProductsFiltersDto } from './dto/products.filters.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { MessageDto } from 'src/common/message.dto';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) { }

    @Post("/create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "vendedor")
    async create(@Body() product: CreateProductDto): Promise<ProductEntity> {
        try {
            return await this.productService.create(product);
        } catch (error) {
            throw error;
        }
    }

    @Get("/all")
    async findAll(): Promise<ProductEntity[]> {
        try {
            return await this.productService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("/one/:id")
    async findById(@Param("id") id: number): Promise<ProductEntity> {
        try {
            return await this.productService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("/name/:name")
    async findByName(@Param("name") name: string): Promise<ProductEntity[]> {
        try {
            return await this.productService.findByName(name);
        } catch (error) {
            throw error;
        }
    }

    @Get("/category/:category")
    async findByCategory(@Param("category") category: number): Promise<ProductEntity[]> {
        try {
            return await this.productService.findByCategory(category);
        } catch (error) {
            throw error;
        }
    }

    @Get("/filters")
    async findByFilters(@Body() filters: ProductsFiltersDto): Promise<ProductEntity[]> {
        try {
            return await this.productService.findByFilters(filters);
        } catch (error) {
            throw error;
        }
    }

    @Put("/update/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "vendedor")
    async update(@Param("id") id: number, @Body() product: UpdateProductDto): Promise<MessageDto> {
        try {
            return await this.productService.update(id, product);
        } catch (error) {
            throw error;
        }
    }

    @Patch("/disable/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "vendedor")
    async disable(@Param("id") id: number): Promise<MessageDto> {
        try {
            return await this.productService.disable(id);
        } catch (error) {
            throw error;
        }
    }

    @Patch("/enable/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin", "vendedor")
    async enable(@Param("id") id: number): Promise<MessageDto> {
        try {
            return await this.productService.enable(id);
        } catch (error) {
            throw error;
        }
    }

    @Delete("/delete/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    async delete(@Param("id")id:number):Promise<MessageDto>{
        try{
            return await this.productService.delete(id);
        }catch(error){
            throw error;
        }
    }
}
