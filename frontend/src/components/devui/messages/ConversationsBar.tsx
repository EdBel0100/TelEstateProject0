"use client";

import React from "react";

const dummyConversations = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
];

const ConversationsBar = () => {
  return (
    <div className="w-64 border-r border-gray-200 dark:border-neutral-700 p-4 bg-gray-100 dark:bg-neutral-800">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <ul className="space-y-2">
        {dummyConversations.map((conv) => (
          <li
            key={conv.id}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer text-sm"
          >
            {conv.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsBar;
