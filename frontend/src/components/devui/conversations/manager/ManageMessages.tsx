"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useGetConversationByManagerQuery } from "@/state/api";
import { ConversationList } from "./ConversationsList";
import { MessagePanel } from "@/components/devui/conversations/manager/MessagesPanel";
import { useCreateMessageMutation } from "@/state/api";
import { Messages, Prisma } from "@database/generated";



export default function ManageMessages() {
  const user = useUser();
  const now = new Date()

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch
  } = useGetConversationByManagerQuery(
    { managerCognitoId: user?.attributes.sub ?? "" },
    { skip: !user?.attributes.sub }
  );
  const [createMessage, { isLoading: messageIsLoading, error: messageError }] = useCreateMessageMutation();


  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId);


  // Convert senderType string to proper union type for MessagePanel
  const messages: Messages[] =
    selectedConversation?.messages?.map((m:Messages) => ({
      ...m,
      senderType: m.senderType as "tenant" | "manager" | "tradeperson",
    })) ?? [];

  const handleSend = async (text: string) => {
    if (!selectedId || !user?.attributes.sub) return;

    try {
      const data: Prisma.MessagesUncheckedCreateInput = {
        conversationId: selectedId,
        content: text,
        senderCognitoId: user.attributes.sub,
        createdAt: now,
        senderType: "manager"
      }
      await createMessage(data).unwrap()
      refetch()
    } catch(err) {
      console.error(`There was an error on creation: ${err}`)
    }
  
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 p-4 h-[calc(100vh-100px)] bg-gray-50">
      <ConversationList
        managerCognitoId={user?.attributes.sub ?? ""}
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
        isLoading={conversationsLoading}
        error={conversationsError}
      />
      <div className="overflow-hidden">
        <MessagePanel conversationId={selectedId} messages={messages} onSend={handleSend} />
      </div>
    </main>
  );
}
