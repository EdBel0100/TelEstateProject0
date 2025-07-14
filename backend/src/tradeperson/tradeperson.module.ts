import { Module } from '@nestjs/common';
import { TradepersonService } from './tradeperson.service';
import { TradepersonController } from './tradeperson.controller';

@Module({
  controllers: [TradepersonController],
  providers: [TradepersonService],
})
export class TradepersonModule {}
