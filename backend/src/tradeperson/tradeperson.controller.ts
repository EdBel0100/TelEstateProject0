import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TradepersonService } from './tradeperson.service';
import { Prisma } from '@database/generated';

@Controller('tradeperson')
export class TradepersonController {
  constructor(private readonly tradepersonService: TradepersonService) {}

  @Post()
  create(@Body() createTradepersonDto: Prisma.TradePersonCreateInput) {
    return this.tradepersonService.create(createTradepersonDto);
  }

  @Get()
  findAll() {
    return this.tradepersonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradepersonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTradepersonDto: Prisma.TradePersonCreateInput) {
    return this.tradepersonService.update(+id, updateTradepersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradepersonService.remove(+id);
  }
}
