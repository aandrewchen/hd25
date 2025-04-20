"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function MicrophoneDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMicrophone, setShowMicrophone] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  // Start recording when drawer opens
  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isOpen]);

  // Show microphone for 1 second then switch to animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowMicrophone(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowMicrophone(true);
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="flex justify-center z-10 -mb-13 w-full">
        <div className="flex flex-col gap-1">
          <div className="rounded-[6rem] bg-[#635BFF] w-[4rem] h-[4rem] flex flex-col gap-1 items-center justify-center">
            <img src="/NavBar/Translate.svg" alt="Translate" />
          </div>
          <p className="text-xs font-medium text-[#000000]">Translate</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center min-h-full">
        <DrawerClose>
          <div className="fixed top-0 left-0 pt-5 pl-3">
            <img src="/Translate/X.svg" alt="X" />
          </div>
        </DrawerClose>
        <DrawerTitle className="text-[#FFFFFF]">
          <p>Translate</p>
        </DrawerTitle>
        <div className="flex flex-col items-center justify-center gap-8">
          <h2 className="text-2xl font-semibold text-[#000000]">
            Speak in the Mic
          </h2>
          {showMicrophone ? (
            <div className="animate-fade-in">
              <img src="/Translate/Microphone.svg" alt="Microphone" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-4">
                {/* Recording animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-500 animate-pulse" />
                </div>
              </div>
              <button
                onClick={handleClose}
                className="mt-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <img src="/Translate/X.svg" alt="Close" />
              </button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
