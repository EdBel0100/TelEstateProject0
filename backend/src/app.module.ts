import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { TradepersonModule } from './tradeperson/tradeperson.module';
import { ManagerModule } from './manager/manager.module';
import { BuildingModule } from './building/building.module';
import { PropertyModule } from './property/property.module';
import { LocationModule } from './location/location.module';
import { PaymentplansModule } from './paymentplans/paymentplans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TicketsModule,
    MessagesModule,
    ConversationsModule,
    AuthModule,
    TenantModule,
    TradepersonModule,
    ManagerModule,
    BuildingModule,
    PropertyModule,
    LocationModule,
    PaymentplansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
