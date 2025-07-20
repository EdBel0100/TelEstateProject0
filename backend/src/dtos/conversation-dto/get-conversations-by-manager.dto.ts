import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class ParticipantDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;
}

export class MessagePreviewDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;

  @IsString()
  senderType: string;

  @IsString()
  createdAt: string;
}

export class ConversationGetManyDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ParticipantDto)
  tenant?: ParticipantDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ParticipantDto)
  tradePerson?: ParticipantDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessagePreviewDto)
  messages?: MessagePreviewDto[];
}
