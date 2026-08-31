import { IsInt, IsOptional, IsString, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {
  @IsInt()
  id: number;

  @IsString()
  senderType: string;

  @IsString()
  senderCognitoId: string;

  @IsString()
  content: string;

  @IsDate()
  createdAt: Date;

  @IsInt()
  conversationId: number;
}

export class GetConversationByTenantDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  managerCognitoId: string;

  @IsOptional()
  @IsString()
  tenantCognitoId?: string | null;

  @IsOptional()
  @IsString()
  tradePersonCognitoId?: string | null;

  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}
