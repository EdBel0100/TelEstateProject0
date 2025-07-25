import { Prisma } from "@database/generated";

export type GetConversationByManagerDto = Prisma.ConversationGetPayload<{
    select: {
      id: true;
      name: true; // if you have name
      managerCognitoId: true;
      tenantCognitoId: true;
      tradePersonCognitoId: true;
      messages: true;
      tenant: true;
    };
  }>;
  