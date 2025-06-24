import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create.category.dto';
import { CategoryEntity } from './entity/category.entity';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { updateCategoryDto } from './dto/update.category.dto';
import { MessageDto } from 'src/common/message.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @Post("/create")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async create(@Body() category: CreateCategoryDto): Promise<CategoryEntity> {
        try {
            return await this.categoryService.create(category);
        } catch (error) {
            throw error;
        }
    }

    @Get("/all")
    async findAll(): Promise<CategoryEntity[]> {
        try {
            return await this.categoryService.findAll();
        } catch (error) {
            throw error;
        }
    }

    @Get("/one/:id")
    async findById(@Param("id") id:number):Promise<CategoryEntity>{
        try {
            return await this.categoryService.findById(id);
        } catch (error) {
            throw error;
        }
    }

    @Get("/name/:name")
    async findByName(@Param("name") name:string):Promise<CategoryEntity>{
        try {
            return await this.categoryService.findByName(name);
        } catch (error) {
            throw error;
        }
    }

    @Post("/update/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async update(@Param("id") id:number,@Body() category:updateCategoryDto):Promise<MessageDto>{
        try {
            if(!category)throw new BadRequestException({message:"la categoria es requerida"});
            return await this.categoryService.update(id,category);
        } catch (error) {
            throw error;
        }
    }

    @Delete("/delete/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin")
    async delete(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.categoryService.delete(id);
        } catch (error) {
            throw error;
        }
    }

    @Patch("/disable/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async disable(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.categoryService.disable(id);
        } catch (error) {
            throw error;
        }
    }

    @Patch("/enable/:id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    async enable(@Param("id") id:number):Promise<MessageDto>{
        try {
            return await this.categoryService.enable(id);
        } catch (error) {
            throw error;
        }
    }
}