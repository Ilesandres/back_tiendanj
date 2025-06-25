import { Module } from '@nestjs/common';
import { VouchersabonosController } from './vouchersabonos.controller';
import { VouchersabonosService } from './vouchersabonos.service';

@Module({
  controllers: [VouchersabonosController],
  providers: [VouchersabonosService]
})
export class VouchersabonosModule {}
