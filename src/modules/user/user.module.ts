import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { PeopleModule } from '../people/people.module';
import { RolModule } from '../rol/rol.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    PeopleModule,
    RolModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
