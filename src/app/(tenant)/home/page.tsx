"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";

export default function Home() {
  const user = useQuery(api.user.currentUser)!;
  const userInfo = useQuery(api.user.getUser, {
    userId: user?._id,
  });
  const housemates = useQuery(api.houses.getHousemates, {
    userId: user?._id,
  });

  return (
    <div className="px-5 pt-10 relative h-1/2 flex flex-col">
      <div className="absolute inset-0 bg-[#635BFF] h-1/2"></div>
      <div className="absolute inset-0 bg-[#FFFFFF] h-1/2 top-1/2"></div>
      <div className="relative z-10 mb-40">
        <div className="flex flex-col gap-5 text-[#FFFFFF] pb-8">
          <p>You are living at</p>
          <div className="flex gap-1">
            <Image
              src="/Home/SmallHome.svg"
              alt="Location"
              width={24}
              height={24}
            />
          </div>
        </div>

        <div className="text-center rounded-lg border border-[#D1D5DB] py-6 px-5 bg-[#FFFFFF] flex flex-col gap-8 mb-4">
          <div className="flex flex-col gap-8 px-3 items-center">
            <h2 className="font-inter font-medium text-[#1D1D1D]">
              Rent for Mar 23 - Apr 23, 2025
            </h2>
            <div className="gap-6 flex flex-col items-center">
              <Image
                src="/Home/TogglePay.svg"
                alt="Toggle"
                width={24}
                height={24}
              />
              <p className="text-5xl font-bold text-[#635BFF]">$1,203.00</p>
            </div>
            <div className="flex justify-between w-58 items-center">
              <p>
                Due <span className="font-bold text-sm">Apr 23</span>
              </p>
              <Image
                src="/Home/Warning.svg"
                alt="Due in 4 Days"
                width={24}
                height={24}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center justify-center rounded-lg p-4 bg-[#635BFF]">
              <Image src="/Home/Pay.svg" alt="Pay" width={24} height={24} />
              <p className="text-[#FFFFFF] font-medium">Pay Now</p>
            </div>
            <div className="flex justify-between"></div>
          </div>
        </div>

        {userInfo?.role === "tenant" && (
          <div className="rounded-lg border border-[#D1D5DB] py-6 px-5 bg-[#FFFFFF] flex flex-col gap-6 mb-4">
            <p className="text-md font-semibold text-[#1D1D1D]">Housemates</p>
            {housemates?.map((housemate) => (
              <div key={housemate._id}>{housemate.name}</div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-[#D1D5DB] py-6 px-5 bg-[#FFFFFF] flex flex-col gap-8 mb-4">
          <p className="text-md font-semibold text-[#1D1D1D]">
            Need home repairs or maintenance?
          </p>
        </div>

        <div className="rounded-lg border border-[#D1D5DB] py-6 px-5 bg-[#FFFFFF] flex flex-col gap-8">
          <p className="text-md font-semibold text-[#1D1D1D]">Landlord</p>
        </div>
      </div>
    </div>
  );
}
