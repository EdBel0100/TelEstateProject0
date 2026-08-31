import { IsInt, IsString, IsDate } from 'class-validator';

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

export type GetMessagesByConversationDto = MessageDto[];
