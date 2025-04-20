"use client";

import { usePathname } from "next/navigation";
import MicrophoneDrawer from "./MicrophoneDrawer";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function NavBar() {
  const pathname = usePathname();
  const user = useQuery(api.user.currentUser)!;

  return (
    <div className="fixed bottom-0 w-full z-10">
      <MicrophoneDrawer />

      <div className="z-0 bottom-0 bg-white border-t border-[#E5E7EB] pt-[0.65rem] px-[0.65rem] pb-[1.9rem]">
        <div className="flex justify-between">
          <div className="flex gap-10 items-center">
            <Link className="flex flex-col gap-1" href="/home">
              {pathname.endsWith("/") ? (
                <Image
                  src="/NavBar/HomeSelected.svg"
                  alt="Home"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/NavBar/HomeNotSelected.svg"
                  alt="Home"
                  width={24}
                  height={24}
                />
              )}

              <p
                className={
                  pathname.endsWith("/")
                    ? "text-xs font-medium  text-[#635BFF]"
                    : "text-xs font-medium  text-[#6B7280]"
                }
              >
                Home
              </p>
            </Link>

            <Link className="flex flex-col gap-1" href="/chats">
              {pathname.endsWith("/chats") ? (
                <Image
                  src="/NavBar/ChatsSelected.svg"
                  alt="Chats"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/NavBar/ChatsNotSelected.svg"
                  alt="Chats"
                  width={24}
                  height={24}
                />
              )}

              <p
                className={
                  pathname.endsWith("/chats")
                    ? "text-xs font-medium  text-[#635BFF]"
                    : "text-xs font-medium  text-[#6B7280]"
                }
              >
                Chats
              </p>
            </Link>
          </div>

          <div className="flex gap-10 items-center">
            <Link className="flex flex-col gap-1" href="/inbox">
              {pathname.endsWith("/inbox") ? (
                <Image
                  src="/NavBar/InboxSelected.svg"
                  alt="Inbox"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/NavBar/InboxNotSelected.svg"
                  alt="Inbox"
                  width={24}
                  height={24}
                />
              )}

              <p
                className={
                  pathname.endsWith("/inbox")
                    ? "text-xs font-medium  text-[#635BFF]"
                    : "text-xs font-medium  text-[#6B7280]"
                }
              >
                Inbox
              </p>
            </Link>

            <Link className="flex flex-col gap-1" href="/profile">
              <Image
                className="rounded-full"
                src={user?.image || "/NavBar/Profile.svg"}
                alt="Profile"
                width={24}
                height={24}
              />

              <p
                className={
                  pathname.endsWith("/profile")
                    ? "text-xs font-medium  text-[#635BFF]"
                    : "text-xs font-medium  text-[#6B7280]"
                }
              >
                Profile
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
