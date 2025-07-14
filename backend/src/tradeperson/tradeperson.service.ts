import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@database/generated';


@Injectable()
export class TradepersonService {
  constructor(private readonly DatabaseService: DatabaseService) {}
  create(createTradepersonDto: Prisma.TradePersonCreateInput) {
    return this.DatabaseService.tradePerson.create({data:createTradepersonDto})
  }

  findAll() {
    return `This action returns all tradeperson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tradeperson`;
  }

  update(id: number, updateTradepersonDto: Prisma.TradePersonUpdateInput) {
    return `This action updates a #${id} tradeperson`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradeperson`;
  }
}
