"use client";

import React, { useState } from "react";
import { useCreateTicketForTenantMutation } from "@/state/api";

const tenantCognitoId = "7fb2fa9ed97d37120bada865cf45453982beca9db52f0815cd163992685263c0"; // or get dynamically

export const CreateTicketPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"urgent" | "concerning" | "warning">("urgent");
  const [createTicket, { isLoading, isError, error, isSuccess }] = useCreateTicketForTenantMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTicket({
        title,
        description,
        status,
        submittedAt: new Date().toISOString(),
        tenantCognitoId,
      }).unwrap();

      // reset form on success
      setTitle("");
      setDescription("");
      setStatus("urgent");
    } catch (err) {
      console.log(err)
      console.error("Failed to create ticket:", err);
    }
  };

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
            onChange={(e) => setStatus(e.target.value as "urgent" | "concerning" | "warning")}
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

        {isError && <p className="text-red-500">Error creating ticket: {(error as any)?.data?.message || String(error)}</p>}
        {isSuccess && <p className="text-green-600">Ticket created successfully!</p>}
      </form>
    </div>
  );
};

export default CreateTicketPage;
