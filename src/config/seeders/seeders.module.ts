import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDniEntity } from 'src/modules/typedni/entity/typedni.entity';
import { RolEntity } from 'src/modules/rol/entity/rol.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { PaymenthMethodEntity } from 'src/modules/paymenthmethod/entity/paymenthMethod.entity';
import { PaymentStatusEntity } from 'src/modules/paymentstatus/entity/paymentstatus.entity';
import { StatusShipmentEntity } from 'src/modules/statusshipment/entity/statusshipment.entity';
import { TypeMeasureEntity } from 'src/modules/typemeasure-medida/entity/typemeasure.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { PeopleEntity } from 'src/modules/people/entity/people.entity';

@Module({
  providers: [SeedersService],
  imports:[
    TypeOrmModule.forFeature([
      TypeDniEntity,
      RolEntity,
      CategoryEntity,
      PaymenthMethodEntity,
      PaymentStatusEntity,
      StatusShipmentEntity,
      TypeMeasureEntity,      
      UserEntity,
      PeopleEntity
    ]),
  ],
})
export class SeedersModule {}
