import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VouchersEntity } from './entity/vouchers.entity';
import { Repository } from 'typeorm';
import { CreateVoucherDto } from './dto/create.voucher.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class VouchersabonosService {
    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>,
        @Inject(forwardRef(() => PaymentService))
        private readonly paymentService: PaymentService
    ) { }

    async findAll(): Promise<VouchersEntity[]> {
        try {
            const vouchers = await this.vouchersRepository.find();
            if (vouchers.length === 0) throw new NotFoundException("no se encontraron vouchers");
            return vouchers;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<VouchersEntity> {
        try {
            const voucher = await this.vouchersRepository.findOne({
                where: {
                    id: id
                }
            });
            if (!voucher) throw new NotFoundException("no se encontró el voucher");
            return voucher;
        } catch (error) {
            throw error;
        }
    }

    async findByPaymentId(paymentId: number): Promise<VouchersEntity> {
        try {
            if (!paymentId) throw new BadRequestException("el id de pago es requerido");
            const voucher = await this.vouchersRepository.findOne({
                where: {
                    payment: {
                        id: paymentId
                    }
                }
            });
            if (!voucher) throw new NotFoundException("no se encontraron abonos para el pago");
            return voucher;
        } catch (error) {
            throw error;
        }
    }

    async create(voucher: CreateVoucherDto): Promise<VouchersEntity> {
        try {
            if (!voucher) throw new BadRequestException("el voucher es requerido");
            if (!voucher.payment) throw new BadRequestException("el id de pago es requerido");
            if (!voucher.value) throw new BadRequestException("el monto es requerido");
            const paymentExist = await this.paymentService.findById(voucher.payment.id);
            //actualizar total del pago
            if (!paymentExist) throw new NotFoundException("no se encontró el pago");
            const newVoucher = this.vouchersRepository.create(voucher);
            return await this.vouchersRepository.save(newVoucher);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, voucher: CreateVoucherDto): Promise<VouchersEntity> {
        try {
            if (!id) throw new BadRequestException("el id es requerido");
            if (!voucher) throw new BadRequestException("el voucher es requerido");
            if (!voucher.payment) throw new BadRequestException("el id de pago es requerido");
            if (!voucher.value) throw new BadRequestException("el monto es requerido");
            const voucherExist = await this.vouchersRepository.findOne({ where: { id: id } });
            if (!voucherExist) throw new NotFoundException("no se encontró el voucher");
            const paymentExist = await this.paymentService.findById(voucher.payment.id);
            if (!paymentExist) throw new NotFoundException("no se encontró el pago");
            const voucherBd = await this.vouchersRepository.findOne({
                where: {
                    id: id
                }
            });
            if (!voucherBd) throw new NotFoundException("no se encontró el voucher");
            //logica para actualizar total del pago, < o menor al valor existene en voucher - |+ valor del voucher
            if (voucher.payment.id !== voucherBd.payment.id) {
                const paymentExist = await this.paymentService.findById(voucher.payment.id);
                if (!paymentExist) throw new NotFoundException("no se encontró el pago");
                voucherBd.payment = paymentExist;
            };
            if (voucher.value){
                voucherBd.value = voucher.value;
            }
            return await this.vouchersRepository.save(voucherBd);
        } catch (error) {
            throw error;
        }
    }

}
