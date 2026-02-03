"use client";

import React from "react";

interface MessageProps {
  message: {
    id: string;
    text: string;
    sender: "user" | "tenant";
    timestamp: string;
  };
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg text-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-gray-200"
        }`}
      >
        <p>{message.text}</p>
        <p className="text-[10px] mt-1 text-right opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default Message;
