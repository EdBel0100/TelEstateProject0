"use client";

import React, { useState } from "react";
import {
  useCreateTicketForTenantMutation,
  useGetPropertyForTenantQuery,
} from "@/state/api";
import { useUser } from "@/hooks/useUser";

export const CreateTicketPage: React.FC = () => {
  const user = useUser();
  const tenantCognitoId = user?.attributes?.sub ?? "";

  // ✅ Always call hooks unconditionally
  const { data: property, isLoading: isLoadingProperty } = useGetPropertyForTenantQuery(
    { tenantCognitoId },
    { skip: !tenantCognitoId }
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"urgent" | "concerning" | "warning">("urgent");
  const [createTicket, { isLoading, isError, error, isSuccess }] =
    useCreateTicketForTenantMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property?.id) {
      console.error("No property found for this tenant.");
      return;
    }

    try {
      await createTicket({
        title,
        description,
        status,
        submittedAt: new Date().toISOString(),
        tenantCognitoId,
        propertyId: property.id,
      }).unwrap();

      setTitle("");
      setDescription("");
      setStatus("urgent");
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  };

  if (!tenantCognitoId) {
    return (
      <p className="text-center py-10 text-red-600">
        Could not identify tenant. Please log in again.
      </p>
    );
  }

  if (isLoadingProperty) {
    return <p className="text-center py-10">Loading property...</p>;
  }

  if (!property) {
    return (
      <p className="text-center py-10 text-red-600">
        No property found for your account.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create New Ticket</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label>
          Title
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </label>

        <label>
          Description
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "urgent" | "concerning" | "warning")
            }
            className="border rounded px-2 py-1 w-full"
          >
            <option value="urgent">Urgent</option>
            <option value="concerning">Concerning</option>
            <option value="warning">Warning</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Ticket"}
        </button>

        {isError && (
          <p className="text-red-500">
            Error creating ticket: {(error as any)?.data?.message || String(error)}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-600">Ticket created successfully!</p>
        )}
      </form>
    </div>
  );
};

export default CreateTicketPage;
