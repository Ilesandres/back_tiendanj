import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
        @Inject(forwardRef(()=>OrderService))
        private readonly orderService: OrderService,
        private readonly variationProductService: VariationproductService,
    ) { }

    async addProductToOrder(productOrderDto: CreateProductOrderDto): Promise<ProductOrderEntity> {
        try {
            if (!productOrderDto || !productOrderDto.order || !productOrderDto.product || !productOrderDto.amount) throw new BadRequestException({ message: "los datos son requeridos" });
            const order = await this.orderService.findById(productOrderDto.order.id);
            if (!order) throw new NotFoundException({ message: "la orden no existe" });
            if (order.payment.status.status == "pagado"){
                const now = new Date();
                const orderDate = order.createdAt;
                
                // Calcular la diferencia de tiempo en milisegundos
                const timeDifference = now.getTime() - orderDate.getTime();
                const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutos en milisegundos
                
                if (timeDifference > fiveMinutesInMs) {
                    throw new BadRequestException({ message: "la orden ya esta pagada" });
                }
            }
            const variationProduct = await this.variationProductService.findById(productOrderDto.product.id);
            if (!variationProduct) throw new NotFoundException({ message: "la variacion del producto no existe" });
            const variationProductExist = await this.productOrderRepository.findOne({
                where: {
                    product: {
                        id: productOrderDto.product.id
                    },
                    order: {
                        id: productOrderDto.order.id
                    }
                }
            })
            if (variationProductExist) throw new BadRequestException({ message: "el producto ya existe en la orden" });
            if (variationProduct.stock < productOrderDto.amount) throw new BadRequestException({ message: "la cantidad de productos en stock es insuficiente" });
            let newStock = Number(variationProduct.stock) - Number(productOrderDto.amount);
            await this.variationProductService.changeStock(variationProduct.id, newStock)
            const productOrder = this.productOrderRepository.create(productOrderDto);
            const productOrderSave = await this.productOrderRepository.save(productOrder);
            await this.updateOrderTotal(productOrderDto.order.id);
            return productOrderSave;
        } catch (error) {
            throw error;
        }
    }

    async updateOrderTotal(orderId: number): Promise<any> {
        try {
            console.log('actualizando total de la orden')
            console.log('orderId',orderId)
            const productsOrder = await this.productOrderRepository.find({
                where: {
                    order: {
                        id: orderId
                    }
                },
                relations: {
                    product: {
                        product: true
                    },
                    order: {
                        payment: {
                            status: true
                        },
                        user: {
                            people: {
                                typeDni: true
                            }
                        },
                        shipment: {
                            status: true
                        }
                    },
                }
            });
            console.log('productsOrder',productsOrder)
            if (productsOrder.length != 0) {
                console.log('generando factura')
                let data: string = "";
                data += `<div style="font-family: Arial, sans-serif; max-width: 400px;">`;
                data += `<h2 style="text-align: center;">Factura</h2>`;
                data += `<p><strong>INVOICE:</strong> #${orderId}</p>`;
                data += `<p><strong>FECHA:</strong> ${new Date().toLocaleDateString()}</p>`;
                data += `<hr>`;
                data += `<h3>Datos del Cliente</h3>`;
                data += `<p><strong>CLIENTE:</strong> ${productsOrder[0].order.user.people.name} ${productsOrder[0].order.user.people.lastname}</p>`;
                data += `<p><strong>DNI:</strong> ${productsOrder[0].order.user.people.dni}</p>`;
                data += `<p><strong>EMAIL:</strong> ${productsOrder[0].order.user.people.email}</p>`;
                data += `<p><strong>TELÉFONO:</strong> ${productsOrder[0].order.user.people.phone}</p>`;
                data += `<hr>`;
                data += `<h3>Productos</h3>`;
                data += `<ul style="padding-left: 20px;">`;

                let total = 0;
                productsOrder.forEach(product => {
                    const subtotal = Number(product.product.price) * Number(product.amount);
                    total += subtotal;
                    data += `<li>${product.product.product.product} x ${product.amount} = $${subtotal.toFixed(2)}</li>`;
                });

                data += `</ul>`;
                data += `<hr>`;
                data += `<p style="font-size: 1.2em;"><strong>Total:</strong> $${total.toFixed(2)}</p>`;
                data += `</div>`;
                console.log('enviando data a bd')
                await this.orderService.updateTotal(orderId, total, data);
            }


            return await this.orderService.findById(orderId);
        } catch (error) {
            throw error;
        }
    }

    async finByOrderId(id: number): Promise<ProductOrderEntity[]> {
        try {
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
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
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            if (!productOrderDto) throw new BadRequestException({ message: "los datos son requeridos" });
            const productOrder = await this.productOrderRepository.findOne({
                where: {
                    id: id
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
            const productOrderSave = await this.productOrderRepository.save(productOrder);
            await this.updateOrderTotal(productOrderDto.order.id);
            return productOrderSave;
        } catch (error) {
            throw error;
        }
    }

    async deleteProductFromOrder(id: number): Promise<MessageDto> {
        try {
            if (!id) throw new BadRequestException({ message: "el id es requerido" });
            const productOrder = await this.productOrderRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    product: true,
                    order:true
                }
            });
            if (!productOrder) throw new NotFoundException({ message: "el producto de la orden no existe" });
            let newStock = Number(productOrder.product.stock) + Number(productOrder.amount);
            await this.variationProductService.changeStock(productOrder.product.id, newStock)
            await this.productOrderRepository.delete(id);
            await this.updateOrderTotal(productOrder.order.id);
            return new MessageDto("producto eliminado de la orden correctamente");
        } catch (error) {
            throw error;
        }
    }

}
