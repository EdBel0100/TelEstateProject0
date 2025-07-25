"use client";

import React, { useState } from "react";
import {
  useGetConversationByTenantQuery,
  useCreateMessageMutation,
} from "@/state/api";
import { useUser } from "@/hooks/useUser";
import { Prisma } from "@database/generated";

export default function TenantMessages() {
  const user = useUser();
  const [messageContent, setMessageContent] = useState("");

  const { data: conversations =[], isLoading, error, refetch } =
    useGetConversationByTenantQuery(
      { tenantCognitoId: user?.attributes.sub ?? "" },
      { skip: !user?.attributes.sub }
    );
    const conversation = conversations[0];
  const [createMessage, { isLoading: isSending }] = useCreateMessageMutation();

  const handleSend = async () => {
    if (!messageContent.trim() || !conversation || !user) return;

    const messageInput: Prisma.MessagesUncheckedCreateInput = {
      content: messageContent.trim(),
      conversationId: conversation.id,
      senderCognitoId: user.attributes.sub,
      senderType: "tenant", // use upper-case if that's your enum format
      createdAt: new Date(), // required field
    };

    try {
      await createMessage(messageInput).unwrap();
      setMessageContent("");
      refetch();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Error sending message.");
    }
  };

  if (!user) return <h1>User not found</h1>;
  if (isLoading) return <p>Loading conversation...</p>;
  if (error) return <p className="text-red-500">Failed to load conversation.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto h-[90vh] flex flex-col bg-white border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Messages with Manager</h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 border p-3 rounded bg-gray-50">
        {conversation?.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded max-w-[70%] ${
                msg.senderCognitoId === user.attributes.sub
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-200"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
