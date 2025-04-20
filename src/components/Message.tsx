import { Id } from "../../convex/_generated/dataModel";

interface MessageProps {
  message: {
    _id: Id<"messages">;
    sender: Id<"users">;
    recipient: Id<"users">;
    body: string;
    translation?: string;
  };
  currentUserId: Id<"users">;
  showOriginalButton?: boolean;
  isLastInGroup?: boolean;
  showOriginal?: boolean;
  onToggleOriginal?: (show: boolean) => void;
}

export default function Message({
  message,
  currentUserId,
  showOriginalButton = true,
  isLastInGroup = false,
  showOriginal = false,
  onToggleOriginal,
}: MessageProps) {
  const isSelf = message.sender === currentUserId;

  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-1`}>
      <div className="flex flex-col">
        {/* For sender, just show the original message */}
        {isSelf && (
          <div className="rounded-[24px] px-4 py-2 text-sm break-words whitespace-pre-wrap bg-[#635BFF] text-[#F9FAFB]">
            {message.body}
          </div>
        )}

        {/* For recipient, show translation first */}
        {!isSelf && (
          <>
            {/* Translation bubble - shown first */}
            {message.translation && (
              <div className="rounded-[24px] px-4 py-2 text-sm break-words whitespace-pre-wrap bg-[#F7F7F7] text-[#1D1D1D]">
                {message.translation}
              </div>
            )}

            {/* Hide/Show Original button - right-aligned */}
            {message.translation &&
              showOriginalButton &&
              isLastInGroup &&
              onToggleOriginal && (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => onToggleOriginal(!showOriginal)}
                    className="text-xs text-[#635BFF] font-semibold"
                  >
                    {showOriginal ? "Hide Original" : "Show Original"}
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
