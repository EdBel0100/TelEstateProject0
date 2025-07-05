"use client";

import Conversation from "@/components/devui/messages/Conversation";
import ConversationsBar from "@/components/devui/messages/ConversationsBar";

const MessagingPage = () => {
  return (
    <div className="flex h-full bg-white dark:bg-neutral-900">
      <ConversationsBar />
      <Conversation />
    </div>
  );
};

export default MessagingPage;
