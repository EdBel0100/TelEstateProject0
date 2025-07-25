import { Prisma } from "@database/generated";

export type GetConversationByTenantDto = Prisma.ConversationGetPayload<{
  include: {
    id: true;
    name: true; // if you have name
    managerCognitoId: true;
    tenantCognitoId: true;
    tradePersonCognitoId: true;
    messages: true;
  };
}>;