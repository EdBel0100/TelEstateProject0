"use client";

import React, { useState } from "react";
import {
  useGetAllTenantByManagerQuery,
  useCreateConversationForManagersMutation,
  useGetConversationByManagerQuery,
} from "@/state/api";
import { Prisma } from "@database/generated";

interface CreateConversationModalProps {
  managerCognitoId: string;
  onClose: () => void;
}

export function CreateConversationModal({
  managerCognitoId,
  onClose,
}: CreateConversationModalProps) {
  const { refetch } = useGetConversationByManagerQuery({ managerCognitoId });
  const { data: tenants, isLoading, isError } = useGetAllTenantByManagerQuery({
    managerCognitoId,
  });
  const [createConversation, { isLoading: isCreating }] =
    useCreateConversationForManagersMutation();

  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [conversationName, setConversationName] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async () => {
    setFormError(null);

    if (!selectedTenantId) {
      setFormError("Please select a tenant.");
      return;
    }
    if (!conversationName.trim()) {
      setFormError("Please enter a conversation name.");
      return;
    }

    const conversationInput: Prisma.ConversationCreateInput = {
      name: conversationName.trim(),
      manager: {
        connect: { cognitoId: managerCognitoId },
      },
      tenant: {
        connect: { cognitoId: selectedTenantId },
      },
    };

    try {
      const result = await createConversation(conversationInput).unwrap();
      console.log("Conversation created:", result);
      refetch();
      onClose();
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setFormError("Failed to create conversation. Please try again.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="text-xl font-semibold mb-4">Create New Conversation</h2>

        <label className="block mb-4">
          Conversation Name
          <input
            type="text"
            value={conversationName}
            onChange={(e) => setConversationName(e.target.value)}
            placeholder="Enter conversation name"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-4">
          Select Tenant
          {isLoading && <p>Loading tenants...</p>}
          {isError && (
            <p className="text-red-500">Error loading tenants. Try again.</p>
          )}
          {!isLoading && tenants && tenants.length === 0 && (
            <p>No tenants found.</p>
          )}
          {!isLoading && tenants && tenants.length > 0 && (
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.cognitoId} value={tenant.cognitoId}>
                  {tenant.firstName} {tenant.lastName} ({tenant.email})
                </option>
              ))}
            </select>
          )}
        </label>

        {formError && (
          <p className="text-red-500 text-sm mb-3">{formError}</p>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isCreating ? "Creating..." : "Create Conversation"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 380px;
          max-width: 95vw;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
