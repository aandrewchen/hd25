"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import { useState, useRef } from "react";
import { ElevenLabsClient } from "elevenlabs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MicrophoneDrawer() {
  const user = useQuery(api.user.currentUser)!;
  const userInfo = useQuery(api.user.getUser, {
    userId: user?._id,
  });

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const client = new ElevenLabsClient({
        apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
      });

      const result = await client.speechToText.convert({
        file: audioBlob,
        model_id: "scribe_v1",
        tag_audio_events: true,
        language_code: userInfo?.language || "eng",
        diarize: true,
      });

      console.log("Transcription:", result);
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Error transcribing audio. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      console.log("Microphone access granted, creating MediaRecorder...");

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log("Data available:", event.data.size, "bytes");
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        console.log("MediaRecorder started");
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
      };

      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped");
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        console.log("Recording completed, blob size:", audioBlob.size);

        // Start transcription
        await transcribeAudio(audioBlob);

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Track stopped:", track.kind);
        });
      };

      // Request data every 1 second
      mediaRecorder.start(1000);
      setIsRecording(true);
      console.log("Recording state set to true");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (error instanceof Error) {
        alert(`Error accessing microphone: ${error.message}`);
      } else {
        alert(
          "Error accessing microphone. Please ensure you have granted microphone permissions."
        );
      }
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        console.log("Recording stopped successfully");
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  return (
    <Drawer>
      <DrawerTrigger className="flex justify-center z-10 -mb-15 w-full">
        <div className="flex flex-col gap-1">
          <div className="rounded-[6rem] bg-[#635BFF] w-[4rem] h-[4rem] flex flex-col gap-1 items-center justify-center">
            <Image
              src="/NavBar/Translate.svg"
              alt="Translate"
              width={24}
              height={24}
            />
          </div>
          <p className="text-xs font-medium text-[#000000]">Translate</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center min-h-full">
        <DrawerClose>
          <div className="fixed top-0 left-0 pt-5 pl-3">
            <Image src="/Translate/X.svg" alt="X" width={40} height={40} />
          </div>
        </DrawerClose>
        <DrawerTitle className="text-[#FFFFFF]">
          <p>Translate</p>
        </DrawerTitle>
        <div
          className="flex flex-col items-center justify-center gap-8"
          onClick={isRecording ? stopRecording : startRecording}
        >
          <button
            className={`text-2xl font-semibold ${
              isRecording ? "text-red-500" : "text-[#000000]"
            }`}
          >
            {isRecording ? "Stop Recording" : "Speak in the Mic"}
          </button>
          <Image
            src="/Translate/Microphone.svg"
            alt="Microphone"
            width={100}
            height={100}
            className={isRecording ? "animate-pulse" : ""}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
