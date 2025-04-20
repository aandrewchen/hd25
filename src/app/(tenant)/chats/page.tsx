"use client";

import Image from "next/image";

export default function Chats() {
  return (
    <div className="px-5 pt-10">
      <div className="flex gap-2 items-center pt-3">
        <Image src="/Chats/ChatIcon.svg" alt="Chats" width={24} height={24} />
        <h1 className="text-2xl text-[#0D0D0D] font-semibold">Chats</h1>
      </div>
      <div className="p-5"></div>
    </div>
  );
}
