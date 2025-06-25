import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './entity/color.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ColorEntity]),
  ],
  controllers: [ColorController],
  providers: [ColorService],
  exports:[ColorService],
})
export class ColorModule {}
