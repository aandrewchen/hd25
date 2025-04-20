"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

export default function Chats() {
  const user = useQuery(api.user.currentUser)!;
  const chats = useQuery(api.chat.getChats, { userId: user?._id });

  return (
    <div className="px-5 pt-10">
      <div className="flex gap-2 items-center pt-3 pb-3">
        <Image src="/Chats/ChatIcon.svg" alt="Chats" width={24} height={24} />
        <h1 className="text-2xl text-[#0D0D0D] font-semibold">Chats</h1>
      </div>
      {chats &&
        chats.map((chat) => (
          <Link
            key={chat._id}
            href={`/chats/${chat.otherUser._id}`}
            className="flex items-center gap-4 py-5 hover:bg-gray-50"
          >
            {chat.otherUser.image ? (
              <Image
                src={chat.otherUser.image}
                alt={chat.otherUser.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
            )}
            <div className="flex justify-between items-center w-full">
              <div>
                <div className="font-medium">
                  {chat.otherUser.name || "Anonymous"}
                </div>
                {chat.lastMessage && (
                  <div className="text-sm text-gray-500">
                    {chat.lastMessage}
                  </div>
                )}
              </div>
              {chat.lastMessageTime && (
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          </Link>
        ))}
    </div>
  );
}
