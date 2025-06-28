import { Module } from '@nestjs/common';
import { SpiceController } from './spice.controller';
import { SpiceService } from './spice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpiceEntity } from './entity/spice.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([SpiceEntity])
  ],
  controllers: [SpiceController],
  providers: [SpiceService],
  exports:[SpiceService]
})
export class SpiceModule {}
