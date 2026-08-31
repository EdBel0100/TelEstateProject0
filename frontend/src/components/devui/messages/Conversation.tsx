"use client";

import React, { useState } from "react";
import Message from "./Message";

const dummyMessages: {
    id: string;
    text: string;
    sender: "user" | "tenant"; // <-- enforce the correct type
    timestamp: string;
  }[] = [
    {
      id: "1",
      text: "Hello, is the rent due?",
      sender: "tenant", // ✅ matches the union type
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      text: "Yes, it's due on the 1st.",
      sender: "user", // ✅ matches the union type
      timestamp: new Date().toISOString(),
    },
  ];
  

const Conversation = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: String(messages.length + 1),
        text: input,
        sender: "user",
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col flex-1 border-l border-gray-200 dark:border-neutral-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      <div className="border-t px-4 py-3 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg p-2 text-sm bg-gray-100 dark:bg-neutral-800 dark:text-white"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-primary-700 text-white text-sm rounded-lg hover:bg-primary-800"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
