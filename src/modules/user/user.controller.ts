import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { SearchUserFilterDto } from './dto/search.user.filter.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService:UserService
    ){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","vendedor")
    @Post("filters")
    async searchUser(@Body() filter:SearchUserFilterDto):Promise<Omit<UserEntity,"password">[]>{
        return this.userService.searchUser(filter);
    }
}
