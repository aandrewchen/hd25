"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

export default function Chat() {
  const params = useParams();
  const recipientId = params.slug! as Id<"users">;
  const user = useQuery(api.user.currentUser)!;
  const recipient = useQuery(api.user.getUser, { userId: recipientId })!;
  const messages = useQuery(api.chat.getMessages, {
    userId: user?._id,
    recipientId: recipientId,
  });
  const sendMessage = useMutation(api.chat.sendMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user || !recipient) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader recipient={recipient} />
      <MessageList messages={messages || []} currentUserId={user._id} />
      <div ref={messagesEndRef} />
      <MessageInput
        onSendMessage={async (message) => {
          await sendMessage({
            sender: user._id,
            recipient: recipientId,
            body: message,
          });
        }}
      />
    </div>
  );
}
