import { Doc } from "../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Doc<"messages">[];
  currentUserId: string;
}

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages?.map((message) => (
        <div
          key={message._id}
          className={`flex ${message.sender === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-[24px] px-4 py-2 ${
              message.sender === currentUserId
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            <div className="break-words whitespace-pre-wrap">
              {message.body}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
