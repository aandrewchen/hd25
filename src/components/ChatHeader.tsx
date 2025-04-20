import Image from "next/image";
import Link from "next/link";
import { Doc } from "../../convex/_generated/dataModel";

interface ChatHeaderProps {
  recipient: Doc<"userInfo">;
}

export default function ChatHeader({ recipient }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
      <Link href="/chats" className="hover:bg-gray-100 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>
      {recipient.image ? (
        <Image
          src={recipient.image}
          alt={recipient.name || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
      )}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <div className="font-medium">{recipient.name || "Anonymous"}</div>
          <div className="text-sm text-[#6B7280]">{recipient.role}</div>
        </div>

        <Image
          src="/Chats/ThreeButtons.svg"
          alt="Three Buttons"
          width={18}
          height={18}
        />
      </div>
    </div>
  );
}
