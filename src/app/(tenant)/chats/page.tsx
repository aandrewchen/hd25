"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function Chats() {
  return (
    <div className="px-5 pt-10">
      <div className="flex gap-2 items-center pt-3">
        <img src="/Chats/ChatIcon.svg" alt="Chats" />
        <h1 className="text-2xl text-[#0D0D0D] font-semibold">Chats</h1>
      </div>
      <div className="p-5"></div>
    </div>
  );
}
