"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationGetManyDto } from "@DTO/conversation-dto/get-conversations-by-manager.dto";

import {
  useDeleteConversationMutation,
  useGetConversationByManagerQuery,
} from "@/state/api";

import { CreateConversationModal } from "./CreateConversationModal";
import { ConversationDeleteConfirmModal } from "./ConversationDeleteConfirmModal"; // adjust path if needed

interface ConversationListProps {
  managerCognitoId: string;
  conversations: ConversationGetManyDto[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isLoading: boolean;
  error?: any;
}

export const ConversationList = ({
  managerCognitoId,
  conversations,
  selectedId,
  onSelect,
  isLoading,
  error,
}: ConversationListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refetch } = useGetConversationByManagerQuery({ managerCognitoId });
  const [deleteConversation] = useDeleteConversationMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const formatParticipantName = (conversation: ConversationGetManyDto) => {
    if (conversation.tenant) {
      const { firstName, lastName } = conversation.tenant;
      return `${firstName} ${lastName}`;
    }
    if (conversation.tradePerson) {
      const { firstName, lastName, companyName } = conversation.tradePerson;
      return `${firstName} ${lastName} (${companyName})`;
    }
    return "Unknown participant";
  };

  const confirmDelete = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    setConversationToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const handleConfirmedDelete = async () => {
    if (!conversationToDelete) return;
    try {
      await deleteConversation({ id: conversationToDelete.id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <>
      <aside className="w-[320px] h-full border-r overflow-y-auto p-4 bg-white flex flex-col">
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create Conversation
        </button>

        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="mb-4">
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <p className="text-red-500">Error loading conversations.</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500">No conversations found.</p>
        ) : (
          conversations.map((conversation) => (
            <Card
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "relative hover:shadow-md transition-shadow cursor-pointer mb-4",
                selectedId === conversation.id &&
                  "border-primary ring-2 ring-primary/50"
              )}
            >
              <CardHeader className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  {conversation.name}
                </CardTitle>
                <button
                  className="text-gray-400 hover:text-red-600 transition"
                  onClick={(e) =>
                    confirmDelete(e, conversation.id, conversation.name)
                  }
                  title="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="font-medium">
                  {formatParticipantName(conversation)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Last message:{" "}
                  {conversation.messages?.[0]?.content?.slice(0, 40) ??
                    "No messages yet"}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </aside>

      {isModalOpen && (
        <CreateConversationModal
          managerCognitoId={managerCognitoId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {conversationToDelete && (
        <ConversationDeleteConfirmModal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmedDelete}
          conversationName={conversationToDelete.name}
        />
      )}
    </>
  );
};
