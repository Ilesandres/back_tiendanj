import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Usuario } from 'src/interfaces/usuario';
import { VerifyUserDto } from '../dto-mails/verify.user.dto';

@Injectable()
export class MailsService {

    constructor(
        private readonly mailerService: MailerService,
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

    async sendUserVerify(user:VerifyUserDto){
        const url=user.url + "/verifyToken/" + user.token;
        await this.mailerService.sendMail({
            to:user.email,
            subject:"Tienda Backend - Verificar usuario",
            template:"./verify-user",
            context:{
                name:user.name,
                verificationCode:user.verificationCode,
                token:user.token,
                url:url
            }
        })
    }
    
}
