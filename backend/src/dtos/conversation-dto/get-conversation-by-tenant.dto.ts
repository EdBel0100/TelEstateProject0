export type ConversationGetByTenantDto = {
    id: number;
    name: string;
    managerCognitoId: string;
    tenantCognitoId: string | null;
    tradePersonCognitoId?: string | null;
    messages: {
      id: number;
      content: string;
      createdAt: Date;
      senderCognitoId: string;
      senderType: "tenant" | "manager" | "tradeperson";
      conversationId: number; // ✅ include if needed
    }[];
  };
  