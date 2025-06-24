import { Module } from '@nestjs/common';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from './entity/rol.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([RolEntity])
  ],
  controllers: [RolController],
  providers: [RolService],
  exports:[RolService]
})
export class RolModule {}
