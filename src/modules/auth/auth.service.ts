import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailsService } from 'src/core/mails/mails.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../user/dto/login.dto';
import { GenerateTokenDto } from './dto/generate.token.dto';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { MessageDto } from 'src/common/message.dto';
import { UpdateUserDto } from '../user/dto/update.user.dto';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
    constructor (
        private readonly userService:UserService,
        private readonly jwtService:JwtService,
        private readonly mailService:MailsService,
        private readonly configService:ConfigService,
    ){}

    async generateToken(id:number):Promise<any>{
        try {
            const userExist=await this.userService.findById(id);
            if(!userExist){
                throw new NotFoundException({message:"usuario no encontrado"})
            }
            if(!userExist.verify){
                throw new BadRequestException({message:"el usuario no esta verificado"})
            }
            if(!userExist.rol){
                throw new BadRequestException({message:"el usuario no tiene un rol"})
            }
            if(!userExist.user){
                throw new BadRequestException({message:"el usuario no tiene un nombre de usuario"})
            }
            if(!userExist.id){
                throw new BadRequestException({message:"el usuario no tiene un id"})
            }
            const payload={
                id:userExist.id,
                user:userExist.user,
                rol:userExist.rol.rol,
                verify:userExist.verify
            }
            const token={
                acces_token:this.jwtService.sign(payload),
            };
            return token;
        } catch (error) {
            throw error;
        }
    }

    async login(user:LoginDto):Promise<any>{
        try {
            const userExist= await this.userService.login(user);
            if(!userExist){
                throw new UnauthorizedException({message:"usuario o contraseña incorrectos"})
            };
            const token=await this.generateToken(userExist.id);
            return token;
        } catch (error) {
            throw error;
        }
    }

    async registerUser(user:CreateUserDto):Promise<any>{
        try {
            const userExist=await this.userService.createUser(user);
            if(!userExist){
                throw new BadRequestException({message:"error al crear el usuario"})
            }
            return new MessageDto("usuario creado correctamente");
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id:number,user:UpdateUserDto, decodedToken:any):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userService.updateUser(id,user,decodedToken);
            if(!userExist){
                throw new BadRequestException({message:"error al actualizar el usuario"})
            }
            return userExist;
        } catch (error) {
            throw error;
        }
    }

    async blockUser(id:number,):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userService.blockUser(id);
            return userExist;
        } catch (error) {
            throw error;
        }
    }

    async unblockUser(id:number):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userService.unblockUser(id);
            return userExist;
        } catch (error) {
            throw error;
        }
    }
    async getUserInfoDni(dni:string):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userService.getUserInfoDni(dni);
            if(!userExist){
                throw new NotFoundException({message:"usuario no encontrado"})
            }
            return userExist;
        } catch (error) {
            throw error;
        }
    }

    async getUserInfoEmail(email:string):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userService.findByEmail(email);
            return userExist;
        } catch (error) {
            throw error;
        }
    }

    async getUserInfoUsername(username:string):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userService.findByUsername(username);
            return userExist;
        } catch (error) {
            throw error;
        }
    }
    async getUserInfoId(id:number):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userService.findById(id);
            return userExist;
        } catch (error) {
            throw error;
        }
    }
}
