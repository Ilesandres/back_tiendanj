import { BadRequestException, Body, Controller, Get, Headers, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { MessageDto } from 'src/common/message.dto';
import { UpdateUserDto } from '../user/dto/update.user.dto';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from './decorators/roles.decorators';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        private readonly jwtService:JwtService,
    ){}

    @Post('login')
    async login(@Body() loginDto:LoginDto){
        try {
            if(!loginDto.user || !loginDto.password){
                throw new BadRequestException({message:"el usuario y la contraseña son requeridos"})
            }
            return this.authService.login(loginDto);
        } catch (error) {
            throw error;
        }
        
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin','vendedor')
    @Post('/register/user')
    async registerUser(@Body() user:CreateUserDto):Promise<MessageDto>{
        try {
            if(!user.people.name || !user.people.phone || !user.people.birthdate || !user.people.typeDni || !user.people.dni){
                throw new BadRequestException({message:"el nombre, telefono, fecha de nacimiento, tipo de documento y dni son requeridos"})
            }
            return this.authService.registerUser(user);
        } catch (error) {
            throw error;
        }
    }

    @Post('/update/user/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateUser(@Param('id')id:number,@Body() user:UpdateUserDto,@Headers('authorization') authHeader:string):Promise<any>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const token=authHeader?.replace('Bearer ','');
            if(!token)throw new UnauthorizedException({message:"token requerido"});
            const decodedToken=this.jwtService.verify(token);
            if(!decodedToken)throw new UnauthorizedException({message:"token invalido"});
            console.log(decodedToken)

            return await this.authService.updateUser(id,user,decodedToken);
        
        } catch (error) {
            if(error instanceof UnauthorizedException){
                throw new UnauthorizedException({message:error.message});
            }
            if(error instanceof BadRequestException){
                throw new BadRequestException({message:error.message});
            }
            if(error instanceof NotFoundException){
                throw new NotFoundException({message:error.message});
            }
            if(error instanceof JsonWebTokenError){
                throw new UnauthorizedException({message:error.message});
            }
            if(error instanceof InternalServerErrorException){
                throw new InternalServerErrorException({message:error.message});
            }
            throw error;
        }
    }

    @Patch('/block/user/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async blockUser(@Param('id')id:number,@Headers('authorization') authHeader:string):Promise<any>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const token=authHeader?.replace('Bearer ','');
            if(!token)throw new UnauthorizedException({message:"token requerido"});
            const decodedToken=this.jwtService.verify(token);
            if(!decodedToken)throw new UnauthorizedException({message:"token invalido"});
            return await this.authService.blockUser(id);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/unblock/user/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async unblockUser(@Param('id')id:number,@Headers('authorization') authHeader:string):Promise<any>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const token=authHeader?.replace('Bearer ','');
            if(!token)throw new UnauthorizedException({message:"token requerido"});
            const decodedToken=this.jwtService.verify(token);
            if(!decodedToken)throw new UnauthorizedException({message:"token invalido"});
            return await this.authService.unblockUser(id);
        } catch (error) {
            throw error;
        }
    }

    @Get('/user/info/dni/:dni')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin','vendedor')
    async getUserInfoDni(@Param('dni')dni:string):Promise<any>{
        try {
            return await this.authService.getUserInfoDni(dni);
        } catch (error) {
            throw error;
        }
    }
}
