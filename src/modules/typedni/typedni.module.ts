import { Module } from '@nestjs/common';
import { TypedniController } from './typedni.controller';
import { TypedniService } from './typedni.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDniEntity } from './entity/typedni.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TypeDniEntity])],
  controllers: [TypedniController],
  providers: [TypedniService],
  exports:[TypedniService]
})
export class TypedniModule {}
