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
  createdAt: Date; // Date serialized as ISO string

  @IsInt()
  conversationId: number;
}

export class TenantDto {
  @IsInt()
  id: number;

  @IsString()
  cognitoId: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsInt()
  propertyId: number;
}

export class GetConversationByManagerDto {
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

  @IsOptional()
  @ValidateNested()
  @Type(() => TenantDto)
  tenant: TenantDto| null;
}
