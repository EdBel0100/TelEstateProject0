"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Plus, Trash2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GetConversationByManagerDto } from "@DTO/conversation-dto/get-conversations-by-manager.dto";

import {
  useDeleteConversationMutation,
  useGetConversationByManagerQuery,
  useGetConversationByTenantNameQuery,
} from "@/state/api";

import { CreateConversationModal } from "./CreateConversationModal";
import { ConversationDeleteConfirmModal } from "./ConversationDeleteConfirmModal";

interface ConversationListProps {
  managerCognitoId: string;
  conversations: GetConversationByManagerDto[];
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

  // Lookup state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lookupTriggered, setLookupTriggered] = useState(false);

  const {
    data: lookupResults,
    isFetching: isLookingUp,
    isError: isLookupError,
  } = useGetConversationByTenantNameQuery(
    { tenantFirstName: firstName, tenantLastName: lastName },
    { skip: !lookupTriggered || (!firstName && !lastName) }
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleLookup = () => {
    if (firstName || lastName) setLookupTriggered(true);
  };

  const handleClearLookup = () => {
    setFirstName("");
    setLastName("");
    setLookupTriggered(false);
  };

  const formatParticipantName = (conversation: GetConversationByManagerDto) => {
    if (conversation.tenant) {
      const { firstName, lastName } = conversation.tenant;
      return `${firstName} ${lastName}`;
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

  // Use lookup results if a search is active, otherwise use passed-in conversations
  const displayedConversations =
    lookupTriggered && lookupResults ? lookupResults : conversations;
  const displayIsLoading = lookupTriggered ? isLookingUp : isLoading;
  const displayError = lookupTriggered ? isLookupError : error;

  return (
    <>
      <aside className="w-[320px] h-full border-r overflow-y-auto p-4 bg-white flex flex-col">
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create Conversation
        </button>

        {/* Lookup bar */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setLookupTriggered(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              className="flex-1 min-w-0 border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setLookupTriggered(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              className="flex-1 min-w-0 border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLookup}
              disabled={!firstName && !lastName}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            {lookupTriggered && (
              <button
                onClick={handleClearLookup}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 transition"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
          {lookupTriggered && (
            <p className="text-xs text-gray-400">
              {isLookingUp
                ? "Searching..."
                : isLookupError
                ? "Search failed."
                : `${lookupResults?.length ?? 0} result(s) for "${firstName} ${lastName}"`}
            </p>
          )}
        </div>

        {/* Conversation list */}
        {displayIsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="mb-4">
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : displayError ? (
          <p className="text-red-500">Error loading conversations.</p>
        ) : displayedConversations.length === 0 ? (
          <p className="text-gray-500">No conversations found.</p>
        ) : (
          displayedConversations.map((conversation) => (
            <Card
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "relative hover:shadow-md transition-shadow cursor-pointer mb-4",
                selectedId === conversation.id &&
                  "border-primary ring-2 ring-primary/50"
              )}
            >
              <CardHeader className="flex items-start gap-2">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">{conversation.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground relative pb-8">
                <div className="font-medium">
                  {formatParticipantName(conversation)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Last message:{" "}
                  {conversation.messages?.[0]?.content?.slice(0, 40) ??
                    "No messages yet"}
                </div>
                <button
                  className="absolute bottom-2 right-2 text-gray-400 hover:text-red-600 transition"
                  onClick={(e) =>
                    confirmDelete(e, conversation.id, conversation.name)
                  }
                  title="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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