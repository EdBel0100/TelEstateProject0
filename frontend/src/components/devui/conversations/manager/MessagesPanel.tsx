"use client";

import { use, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessagePreviewDto } from "@DTO/conversation-dto/get-conversations-by-manager.dto";
import { useCreateMessageMutation } from "@/state/api";
import { Prisma } from "@database/generated";


interface MessagePanelProps {
  conversationId: number | null;
  messages: MessagePreviewDto[];
  onSend: (message: string) => void;
}



export const MessagePanel = ({
  conversationId,
  messages,
  onSend,
}: MessagePanelProps) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [data, {isLoading, error}] = useCreateMessageMutation()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <MessageCircle className="w-8 h-8 mb-2" />
        <p>Select a conversation to view messages.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border rounded-xl shadow-sm p-4">
      <ScrollArea className="flex-1 space-y-2 pr-2 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-lg px-4 py-2 max-w-[75%] text-sm",
              msg.senderType === "manager"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-muted text-foreground self-start mr-auto"
            )}
          >
            {msg.content}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </ScrollArea>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            onSend(input.trim());
            setInput("");
          }
        }}
        className="flex gap-2 mt-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};
