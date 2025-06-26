import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOrderEntity } from './entity/productorder.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { VariationproductService } from '../variationproduct/variationproduct.service';
import { CreateProductOrderDto } from './dto/create.product.order.dto';
import { MessageDto } from 'src/common/message.dto';
import { UpdateProductOrderDto } from './dto/update.produc.order.dto';

@Injectable()
export class ProductorderService {
    constructor(
        @InjectRepository(ProductOrderEntity)
        private readonly productOrderRepository: Repository<ProductOrderEntity>,
        private readonly productService: ProductService,
        private readonly orderService: OrderService,
        private readonly variationProductService: VariationproductService,
    ) { }

    async addProductToOrder(productOrderDto: CreateProductOrderDto): Promise<ProductOrderEntity> {
        try {
            if(!productOrderDto || !productOrderDto.order || !productOrderDto.product || !productOrderDto.amount) throw new BadRequestException({ message: "los datos son requeridos" });
            const product = await this.productService.findById(productOrderDto.product.id);
            if (!product) throw new NotFoundException({ message: "el producto no existe" });
            const order = await this.orderService.findById(productOrderDto.order.id);
            if (!order) throw new NotFoundException({ message: "la orden no existe" });
            const variationProduct = await this.variationProductService.findById(productOrderDto.product.id);
            if (!variationProduct) throw new NotFoundException({ message: "la variacion del producto no existe" });
            const variationProductExist= await this.productOrderRepository.findOne({
                where:{
                    product:{
                        id:productOrderDto.product.id
                    },
                    order:{
                        id:productOrderDto.order.id
                    }
                }
            })
            if (variationProductExist) throw new BadRequestException({ message: "el producto ya existe en la orden" });
            if (variationProduct.stock < productOrderDto.amount) throw new BadRequestException({ message: "la cantidad de productos en stock es insuficiente" });
            let newStock = Number(variationProduct.stock) - Number(productOrderDto.amount);
            await this.variationProductService.changeStock(variationProduct.id, newStock)
            const productOrder = this.productOrderRepository.create(productOrderDto);
            return await this.productOrderRepository.save(productOrder);
        } catch (error) {
            throw error;
        }
    }

    async finByOrderId(id: number): Promise<ProductOrderEntity[]> {
        try {
            if(!id) throw new BadRequestException({ message: "el id es requerido" });
            const productOrder = await this.productOrderRepository.find(
                {
                    where: {
                        order: {
                            id: id
                        }
                    }
                }
            );
            return productOrder;
        } catch (error) {
            throw error;
        }
    }

    async updateProductFromOrder(id: number, productOrderDto: UpdateProductOrderDto): Promise<ProductOrderEntity> {
        try {
            if(!id) throw new BadRequestException({ message: "el id es requerido" });
            if(!productOrderDto) throw new BadRequestException({ message: "los datos son requeridos" });
            const productOrder = await this.productOrderRepository.findOne({
                 where: { 
                    id :id
                } 
            });
            if (!productOrder) throw new NotFoundException({ message: "el producto de la orden no existe" });
            if (productOrderDto.product) {
                const product = await this.variationProductService.findById(productOrderDto.product.id);
                if (!product) throw new NotFoundException({ message: "la variacion del producto no existe" });
                productOrder.product = product;
            }
            if (productOrderDto.order) {
                const order = await this.orderService.findById(productOrderDto.order.id);
                if (!order) throw new NotFoundException({ message: "la orden no existe" });
                productOrder.order = order;
            }
            if (productOrderDto.amount) {
                if (productOrder.amount < productOrderDto.amount) {
                    let newStock = Number(productOrder.product.stock) + Number(Number(productOrder.amount) - Number(productOrderDto.amount));
                    await this.variationProductService.changeStock(productOrder.product.id, newStock)
                } else {
                    let newStock = Number(productOrder.product.stock) - Number(Number(productOrderDto.amount) - Number(productOrder.amount));
                    await this.variationProductService.changeStock(productOrder.product.id, newStock)
                }
                productOrder.amount = productOrderDto.amount;
            }
            return await this.productOrderRepository.save(productOrder);
        } catch (error) {
            throw error;
        }
    }

    async deleteProductFromOrder(id: number): Promise<MessageDto> {
        try {
            if(!id) throw new BadRequestException({ message: "el id es requerido" });
            const productOrder = await this.productOrderRepository.findOne({
                where: {
                    id: id
                },
                relations:{
                    product:true,
                }
            });
            if (!productOrder) throw new NotFoundException({ message: "el producto de la orden no existe" });
            let newStock = Number(productOrder.product.stock) + Number(productOrder.amount);
            await this.variationProductService.changeStock(productOrder.product.id, newStock)
            await this.productOrderRepository.delete(id);
            return new MessageDto("producto eliminado de la orden correctamente");
        } catch (error) {
            throw error;
        }
    }

}
