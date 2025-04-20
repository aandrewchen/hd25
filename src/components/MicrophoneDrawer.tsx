"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";

export default function MicrophoneDrawer() {
  const startRecording = () => {};

  return (
    <Drawer>
      <DrawerTrigger className="flex justify-center z-10 -mb-15 w-full">
        <div className="flex flex-col gap-1">
          <div className="rounded-[6rem] bg-[#635BFF] w-[4rem] h-[4rem] flex flex-col gap-1 items-center justify-center">
            <Image src="/NavBar/Translate.svg" alt="Translate" />
          </div>
          <p className="text-xs font-medium text-[#000000]">Translate</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center min-h-full">
        <DrawerClose>
          <div className="fixed top-0 left-0 pt-5 pl-3">
            <Image src="/Translate/X.svg" alt="X" />
          </div>
        </DrawerClose>
        <DrawerTitle className="text-[#FFFFFF]">
          <p>Translate</p>
        </DrawerTitle>
        <div className="flex flex-col items-center justify-center gap-8">
          <button
            className="text-2xl font-semibold text-[#000000]"
            onClick={startRecording}
          >
            Speak in the Mic
          </button>
          <Image src="/Translate/Microphone.svg" alt="Microphone" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
