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
import OpenAI from "openai";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MicrophoneDrawer() {
  const resetAll = () => {
    setMultiTranslation(false);
    setTranslation1("");
    setTranslation2("");
    setIsRecording1(false);
    setIsRecording2(false);
    setShowTranslation1(false);
    setShowTranslation2(false);
  };

  const user = useQuery(api.user.currentUser)!;
  const userInfo = useQuery(api.user.getUser, {
    userId: user?._id,
  });

  const [multiTranslation, setMultiTranslation] = useState(false);
  const [translation1, setTranslation1] = useState("");
  const [translation2, setTranslation2] = useState("");
  const [isRecording1, setIsRecording1] = useState(false);
  const [isRecording2, setIsRecording2] = useState(false);
  const [showTranslation1, setShowTranslation1] = useState(false);
  const [showTranslation2, setShowTranslation2] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const translateAudio1 = async (audioBlob: Blob) => {
    try {
      const elevenLabsClient = new ElevenLabsClient({
        apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
      });

      const openAIclient = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const result = await elevenLabsClient.speechToText.convert({
        file: audioBlob,
        model_id: "scribe_v1",
        tag_audio_events: true,
        language_code: userInfo?.language || "eng",
        diarize: true,
      });

      const response = await openAIclient.responses.create({
        model: "gpt-4.1",
        instructions:
          "Please translate the following text to English. Remove any extra information or noise that might have been in the transcription and just provide the translation. If you cannot figure out the translation, please return, 'Please speak into the microphone again.' Please do not return random text that is not the translation.",
        input: result.text,
      });

      if (response) {
        setTranslation1(response.output_text);
        setShowTranslation1(true);
      }
      return response;
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Error transcribing audio. Please try again.");
    }
  };

  const translateAudio2 = async (audioBlob: Blob) => {
    try {
      const elevenLabsClient = new ElevenLabsClient({
        apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
      });

      const openAIclient = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const result = await elevenLabsClient.speechToText.convert({
        file: audioBlob,
        model_id: "scribe_v1",
        tag_audio_events: true,
        language_code: "eng",
        diarize: true,
      });

      const response = await openAIclient.responses.create({
        model: "gpt-4.1",
        instructions:
          "Please translate the following text to Chinese. Remove any extra information or noise that might have been in the transcription and just provide the translation. If you cannot figure out the translation, please return, 'Please speak into the microphone again.' Please do not return random text that is not the translation.",
        input: result.text,
      });

      if (response) {
        setTranslation2(response.output_text);
        setShowTranslation2(true);
      }
      return response;
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Error transcribing audio. Please try again.");
    }
  };

  const startRecording1 = async () => {
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
        mimeType: "audio/mp4",
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
        const result = await translateAudio1(audioBlob);
        if (result) {
          setTranslation1(result.output_text);
        } else {
          alert("Error translating audio. Please try again.");
        }

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Track stopped:", track.kind);
        });
      };

      // Request data every 1 second
      mediaRecorder.start(1000);
      setIsRecording1(true);
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

  const stopRecording1NotMulti = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording1) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording1(false);
        console.log("Recording stopped successfully");
        setMultiTranslation(true);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const stopRecording1Multi = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording1) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording1(false);
        console.log("Recording stopped successfully");
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const startRecording2 = async () => {
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
        mimeType: "audio/mp4",
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
        const result = await translateAudio2(audioBlob);
        if (result) {
          setTranslation2(result.output_text);
        } else {
          alert("Error translating audio. Please try again.");
        }

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Track stopped:", track.kind);
        });
      };

      // Request data every 1 second
      mediaRecorder.start(1000);
      setIsRecording2(true);
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

  const stopRecording2 = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording2) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording2(false);
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
      <DrawerContent
        className={`flex items-center justify-center min-h-full ${multiTranslation ? "bg-[#F7F7F7]" : ""}`}
      >
        <DrawerClose onClick={() => resetAll()}>
          <div className="fixed top-0 left-0 pt-5 pl-3">
            <Image src="/Translate/X.svg" alt="X" width={40} height={40} />
          </div>
        </DrawerClose>
        <DrawerTitle
          className={`${multiTranslation ? "text-[#F7F7F7]" : "text-[#FFFFFFF]"}`}
        >
          <p></p>
        </DrawerTitle>
        <div className="px-5 min-w-full">
          {multiTranslation ? (
            <div className="flex flex-col p-5 rounded-lg bg-[#FFFFFF] w-full">
              <div className="pb-5 border-b border-[#E5E5E5] h-[300px]">
                <div className="flex justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-[#9CA3AF]">English</p>
                    <p
                      className={`max-w-[225px] z-0 text-2xl font-semibold text-[#000000] transition-opacity duration-500 ${
                        showTranslation1 ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {translation1}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between pt-4 items-end">
                    <div className="flex flex-col gap-3 pr-2">
                      <Image
                        src="/Translate/Speak.svg"
                        alt="Speak"
                        width={25}
                        height={25}
                      />
                      <Image
                        src="/Translate/Copy.svg"
                        alt="Copy"
                        width={25}
                        height={25}
                      />
                    </div>
                    <div
                      onClick={
                        isRecording1 ? stopRecording1Multi : startRecording1
                      }
                      className="z-10"
                    >
                      <Image
                        src="/Translate/BlueMicrophone.svg"
                        alt="Blue Microphone"
                        width={65}
                        height={65}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5 h-[300px]">
                <div className="flex justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-[#9CA3AF]">Chinese</p>
                    <p
                      className={`z-0 text-2xl max-w-[225px] font-semibold text-[#000000] transition-opacity duration-500 ${
                        showTranslation2 ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {translation2}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between pt-4 items-end">
                    <div className="flex flex-col gap-3 pr-2">
                      <Image
                        src="/Translate/Speak.svg"
                        alt="Speak"
                        width={25}
                        height={25}
                      />
                      <Image
                        src="/Translate/Copy.svg"
                        alt="Copy"
                        width={25}
                        height={25}
                      />
                    </div>
                    <div
                      className="z-10"
                      onClick={isRecording2 ? stopRecording2 : startRecording2}
                    >
                      <Image
                        src="/Translate/BlueMicrophone.svg"
                        alt="Blue Microphone"
                        width={65}
                        height={65}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="items-center justify-center flex flex-col gap-8"
              onClick={isRecording1 ? stopRecording1NotMulti : startRecording1}
            >
              <button className="text-2xl font-semibold text-[#000000]">
                {isRecording1 ? "Listening..." : "Speak in the Mic"}
              </button>
              <Image
                src="/Translate/Microphone.svg"
                alt="Microphone"
                width={100}
                height={100}
                className={isRecording1 ? "animate-pulse" : ""}
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
