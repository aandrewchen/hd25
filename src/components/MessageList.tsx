import { useRef, useEffect, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import Message from "./Message";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MessageListProps {
  messages: {
    _id: Id<"messages">;
    sender: Id<"users">;
    recipient: Id<"users">;
    body: string;
    translation?: string;
  }[];
  currentUserId: Id<"users">;
  recipientId: Id<"users">;
}

export default function MessageList({
  messages,
  currentUserId,
  recipientId,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastSenderMessageIndex, setLastSenderMessageIndex] = useState<
    number | null
  >(null);
  const translateExistingMessage = useMutation(
    api.chat.translateExistingMessage
  );
  const [showOriginals, setShowOriginals] = useState<{
    [key: string]: boolean;
  }>({});

  // Get user language preferences
  const currentUser = useQuery(api.user.getUser, { userId: currentUserId });
  const recipientUser = useQuery(api.user.getUser, { userId: recipientId });

  // Check if both users have the same language
  const sameLanguage = currentUser?.language === recipientUser?.language;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Find the index of the last message sent by the current user
  useEffect(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === currentUserId) {
        setLastSenderMessageIndex(i);
        break;
      }
    }
  }, [messages, currentUserId]);

  // Translate messages after the last sender message
  useEffect(() => {
    if (lastSenderMessageIndex !== null && !sameLanguage) {
      const translateMessages = async () => {
        for (let i = lastSenderMessageIndex + 1; i < messages.length; i++) {
          const message = messages[i];
          // Only translate messages that don't already have a translation
          if (!message.translation && message.sender !== currentUserId) {
            try {
              await translateExistingMessage({
                messageId: message._id,
                recipientId: recipientId,
              });
            } catch (error) {
              console.error("Error translating message:", error);
            }
          }
        }
      };

      translateMessages();
    }
  }, [
    lastSenderMessageIndex,
    messages,
    currentUserId,
    recipientId,
    translateExistingMessage,
    sameLanguage,
  ]);

  // Group consecutive messages from the same sender
  const renderMessages = () => {
    if (!messages.length) return null;

    const result = [];
    let currentGroup: typeof messages = [];
    let currentSender = messages[0].sender;

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      // If sender changes or it's the last message, process the current group
      if (message.sender !== currentSender || i === messages.length - 1) {
        // Add the last message to the current group if it's the last message
        if (i === messages.length - 1 && message.sender === currentSender) {
          currentGroup.push(message);
        }

        // Render the current group
        if (currentGroup.length > 0) {
          const groupId = `group-${currentGroup[0]._id}`;
          const showOriginal = showOriginals[groupId] ?? false;
          const hasTranslations =
            !sameLanguage &&
            currentGroup.some(
              (msg) => msg.translation && msg.sender !== currentUserId
            );
          const isSenderGroup = currentGroup[0].sender === currentUserId;

          result.push(
            <div key={groupId} className="mb-2">
              <div
                className={`flex flex-col ${isSenderGroup ? "items-end" : "items-start"}`}
              >
                {/* Render all translations first */}
                {currentGroup.map((msg) => (
                  <Message
                    key={msg._id}
                    message={msg}
                    currentUserId={currentUserId}
                    showOriginalButton={false}
                    isLastInGroup={false}
                    showOriginal={false}
                  />
                ))}

                {/* Render all originals below if showOriginal is true */}
                {showOriginal &&
                  currentGroup.map((msg) => (
                    <div
                      key={`original-${msg._id}`}
                      className="flex justify-start mb-1"
                    >
                      <div className="rounded-[24px] px-4 py-2 text-sm break-words whitespace-pre-wrap bg-[#635bff1a] text-[#1D1D1D]">
                        {msg.body}
                      </div>
                    </div>
                  ))}

                {/* Show/Hide Original button below all messages */}
                {hasTranslations && !isSenderGroup && (
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() =>
                        setShowOriginals((prev) => ({
                          ...prev,
                          [groupId]: !prev[groupId],
                        }))
                      }
                      className="text-xs text-[#635BFF] font-semibold"
                    >
                      {showOriginal ? "Hide Original" : "Show Original"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Start a new group
        currentGroup = [message];
        currentSender = message.sender;
      } else {
        // Add to current group
        currentGroup.push(message);
      }
    }

    return result;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {renderMessages()}
      <div ref={messagesEndRef} />
    </div>
  );
}
