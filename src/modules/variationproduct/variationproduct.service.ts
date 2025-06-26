import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariationProductEntity } from './entity/variationproduct.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CreateVariationProductDto } from './dto/create.varitionproduct.dto';
import { SpiceService } from '../spice/spice.service';
import { ColorService } from '../color/color.service';
import { TypemeasuremedidaService } from '../typemeasuremedida/typemeasuremedida.service';
import { UpdateVariationProductDto } from './dto/update.variationproduct.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class VariationproductService {
    constructor(
        @InjectRepository(VariationProductEntity)
        private readonly variationProductRepository: Repository<VariationProductEntity>,
        private readonly productService: ProductService,
        private readonly spiceService: SpiceService,
        private readonly colorService: ColorService,
        private readonly measureService: TypemeasuremedidaService,
    ) { }

    //trabajando ///modificar --------------------------------------------<<<<<<<<<<<<<<<<<-------------------
    async create(variation: CreateVariationProductDto): Promise<VariationProductEntity> {
        try {
            if (!variation) throw new BadRequestException({ message: "la variacion es requerida" });
            const productExist = await this.productService.findById(variation.product.id);
            if (!productExist) throw new NotFoundException({ message: "el producto no existe" });
            const spiceExist = await this.spiceService.findById(variation.spice.id);
            if (!spiceExist) throw new NotFoundException({ message: "el sabor no existe" });
            const colorExist = await this.colorService.findById(variation.color.id);
            if (!colorExist) throw new NotFoundException({ message: "el color no existe" });
            const measureExist = await this.measureService.findById(variation.measure.id);
            if (!measureExist) throw new NotFoundException({ message: "la medida no existe" });
            const variationExist = await this.variationProductRepository.findOne({
                where: {
                    spice: {
                        id: variation.spice.id
                    },
                    product: {
                        id: variation.product.id
                    },
                    color: {
                        id: variation.color.id
                    },
                    measure: {
                        id: variation.measure.id
                    }
                }
            });
            if (variationExist) throw new BadRequestException({ message: "la variacion ya existe" });
            const newVariation = this.variationProductRepository.create(variation);
            return await this.variationProductRepository.save(newVariation);
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<VariationProductEntity[]> {
        try {
            return await this.variationProductRepository.find({
                relations: {
                    spice: true,
                    product: {
                        category: true
                    },
                    color: true,
                    measure: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findByProductId(id: number): Promise<VariationProductEntity[]> {
        try {
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            return await this.variationProductRepository.find({
                where: { product: { id } }, relations: {
                    spice: true,
                    product: {
                        category: true
                    },
                    color: true,
                    measure: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<VariationProductEntity> {
        try {
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            const variationExist = await this.variationProductRepository.findOne({
                where: { id: id },
                relations: {
                    spice: true,
                    product: {
                        category: true
                    },
                }
            });
            if (!variationExist) throw new NotFoundException({ message: "la variacion no existe" });
            return variationExist;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, variation: UpdateVariationProductDto): Promise<VariationProductEntity> {
        try {
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            if (!variation) throw new BadRequestException({ message: "la variacion es requerida" });
            const variationExist = await this.findById(id);
            if (!variationExist) throw new NotFoundException({ message: "la variacion no existe" });
            if (variation.spice) throw new BadRequestException({ message: "el sabor no puede ser modificado" });
            if (variation.product) throw new BadRequestException({ message: "el producto no puede ser modificado" });
            if (variation.color) throw new BadRequestException({ message: "el color no puede ser modificado" });
            if (variation.measure) throw new BadRequestException({ message: "la medida no puede ser modificada" });
            if (variation.price) variationExist.price = variation.price;
            if (variation.stock) variationExist.stock = variation.stock;
            return await this.variationProductRepository.save(variationExist);
        } catch (error) {
            throw error;
        }
    }

    async changeStatus(id: number): Promise<VariationProductEntity> {
        try {
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            const variationExist = await this.findById(id);
            if (!variationExist) throw new NotFoundException({ message: "la variacion no existe" });
            variationExist.active = !variationExist.active;
            return await this.variationProductRepository.save(variationExist);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<MessageDto> {
        try {
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            const variationExist = await this.findById(id);
            if (!variationExist) throw new NotFoundException({ message: "la variacion no existe" });
            await this.variationProductRepository.delete(id);
            return new MessageDto("la variacion se ha eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }

    async changeStock(id: number, stock: number): Promise<VariationProductEntity> {
        try {
            console.log("stock : ",stock);
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            if ( stock < 0 || stock==null || stock==undefined ) throw new BadRequestException({ message: "el stock es requerido" });
            const variationExist = await this.findById(id);
            if (!variationExist) throw new NotFoundException({ message: "la variacion no existe" });
            variationExist.stock = stock;
            return await this.variationProductRepository.save(variationExist);
        } catch (error) {
            throw error;
        }
    }
}
