import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Usuario } from 'src/interfaces/usuario';
import { VerifyUserDto } from '../dto-mails/verify.user.dto';
import { InvoiceOrderDto } from '../dto-mails/invoice.order.dto';
import { PdfService } from './pdf.service';

@Injectable()
export class MailsService {

    constructor(
        private readonly mailerService: MailerService,
        private readonly pdfService: PdfService,
    ) { }

    //Metodo para enviar un correo electronico (Reestablecer contraseña)
    async sendUserRequestPassword(user: Usuario, resetPasswordCode: string) {
        await this.mailerService.sendMail({
            to: user.usu_email,
            subject: 'Tienda Backend - Reestablecer contraseña',
            template: './reset-password', //Ruta del template
            context: {
                name: user.usu_nombre, //Pasando el nombre del usuario al template
                resetPasswordCode: resetPasswordCode //Pasando el codigo de reestablecimiento al template
            }
        })
    }

    async sendUserVerify(user: VerifyUserDto) {
        const url = user.url + "/verifyToken/" + user.token;
        await this.mailerService.sendMail({
            to: user.email,
            subject: "Tienda Backend - Verificar usuario",
            template: "./verify-user",
            context: {
                name: user.name,
                verificationCode: user.verificationCode,
                token: user.token,
                url: url
            }
        })
    }

    async sendInvoiceOrder(invoiceOrderDto: InvoiceOrderDto) {
        try {
            // Generar el PDF del invoice
            const pdfBuffer = await this.pdfService.generateInvoicePdf(invoiceOrderDto);
            
            // Crear una copia de los datos con subtotales calculados
            const emailData = {
                ...invoiceOrderDto,
                order: {
                    ...invoiceOrderDto.order,
                    productOrder: invoiceOrderDto.order.productOrder?.map(productOrder => ({
                        ...productOrder,
                        subtotal: productOrder.amount * productOrder.product.price
                    }))
                }
            };

            await this.mailerService.sendMail({
                to: invoiceOrderDto.user.people.email,
                subject: 'Tienda Backend - Factura de orden #' + invoiceOrderDto.order.id,
                template: './invoice-order',
                context: {
                    invoiceOrderDto: emailData
                },
                attachments: [
                    {
                        filename: `factura-orden-${invoiceOrderDto.order.id}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            });
            console.log("email enviado correctamente 💵💵");
        } catch (error) {
            console.log("error al enviar el email 💴💴");
            throw error;
        }
    }
}
