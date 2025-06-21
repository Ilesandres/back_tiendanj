import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { MessageDto } from 'src/common/message.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
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
}
