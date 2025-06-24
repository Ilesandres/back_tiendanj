import { Module } from '@nestjs/common';
import { TypemeasuremedidaController } from './typemeasuremedida.controller';
import { TypemeasuremedidaService } from './typemeasuremedida.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeMeasureEntity } from './entity/typemeasure.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([TypeMeasureEntity])
  ],
  controllers: [TypemeasuremedidaController],
  providers: [TypemeasuremedidaService],
  exports:[TypemeasuremedidaService]
})
export class TypemeasuremedidaModule {}
