import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Prisma } from '@database/generated';

@Controller('landlord')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  create(@Body() createManagerDto: Prisma.LandlordCreateInput) {
    return this.managerService.create(createManagerDto);
  }

  @Post('/by-phone')
  async getByPhone(@Body('phoneNumber') phoneNumber: string) {
    const landlord = await this.managerService.findByPhone(phoneNumber);

    return { cognitoId: landlord?.cognitoId ?? null };
  }

  @Get()
  findAll() {
    return this.managerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.managerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateManagerDto: Prisma.LandlordUpdateInput
  ) {
    return this.managerService.update(id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.managerService.remove(id);
  }
}
