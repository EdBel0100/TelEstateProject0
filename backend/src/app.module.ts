import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AuthModule } from "./auth/auth.module"
import { TenantModule } from './tenant/tenant.module';
import { TradepersonModule } from './tradeperson/tradeperson.module';
import { ManagerModule } from './manager/manager.module';
import { BuildingModule } from './building/building.module';
import { PropertyModule } from './property/property.module';
import { LocationModule } from './location/location.module';


@Module({
  imports: [DatabaseModule, TicketsModule, MessagesModule, ConversationsModule, AuthModule, TenantModule, TradepersonModule, ManagerModule, BuildingModule, PropertyModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
