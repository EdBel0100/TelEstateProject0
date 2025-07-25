import type { Messages } from '@database/generated';

export type MessageDto = Messages; // or select a subset of fields if you want

export type GetMessagesByConversationDto = MessageDto[];