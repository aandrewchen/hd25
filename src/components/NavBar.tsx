"use client";

import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-col gap-1 items-center z-10 -mb-13 w-full">
        <div className="rounded-[6rem] bg-[#635BFF] w-[4rem] h-[4rem] flex flex-col gap-1">
          <img src="/NavBar/Translate.svg" alt="Translate" />
        </div>
        <p className="text-xs font-medium font-inter text-[#000000]">
          Translate
        </p>
      </div>

      <div className="z-0 bottom-0 bg-white border-t border-[#E5E7EB] pt-[0.65rem] px-[0.65rem] pb-[1.9rem]">
        <div className="flex justify-between">
          <div className="flex gap-10 items-center">
            <a className="flex flex-col gap-1" href="/">
              {pathname.endsWith("/") ? (
                <img src="/NavBar/HomeSelected.svg" alt="Home" />
              ) : (
                <img src="/NavBar/HomeNotSelected.svg" alt="Home" />
              )}

              <p
                className={
                  pathname.endsWith("/")
                    ? "text-xs font-medium font-inter text-[#635BFF]"
                    : "text-xs font-medium font-inter text-[#6B7280]"
                }
              >
                Home
              </p>
            </a>

            <a className="flex flex-col gap-1" href="/chats">
              {pathname.endsWith("/chats") ? (
                <img src="/NavBar/ChatsSelected.svg" alt="Chats" />
              ) : (
                <img src="/NavBar/ChatsNotSelected.svg" alt="Chats" />
              )}

              <p
                className={
                  pathname.endsWith("/chats")
                    ? "text-xs font-medium font-inter text-[#635BFF]"
                    : "text-xs font-medium font-inter text-[#6B7280]"
                }
              >
                Chats
              </p>
            </a>
          </div>

          <div className="flex gap-10 items-center">
            <a className="flex flex-col gap-1" href="/inbox">
              {pathname.endsWith("/inbox") ? (
                <img src="/NavBar/InboxSelected.svg" alt="Inbox" />
              ) : (
                <img src="/NavBar/InboxNotSelected.svg" alt="Inbox" />
              )}

              <p
                className={
                  pathname.endsWith("/inbox")
                    ? "text-xs font-medium font-inter text-[#635BFF]"
                    : "text-xs font-medium font-inter text-[#6B7280]"
                }
              >
                Inbox
              </p>
            </a>

            <a className="flex flex-col gap-1" href="/profile">
              {pathname.endsWith("/profile") ? (
                <img src="/NavBar/Profile.svg" alt="Profile" />
              ) : (
                <img src="/NavBar/Profile.svg" alt="Profile" />
              )}

              <p
                className={
                  pathname.endsWith("/profile")
                    ? "text-xs font-medium font-inter text-[#635BFF]"
                    : "text-xs font-medium font-inter text-[#6B7280]"
                }
              >
                Profile
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
