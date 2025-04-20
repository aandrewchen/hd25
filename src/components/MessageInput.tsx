interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem(
          "message"
        ) as HTMLInputElement;
        const message = input.value.trim();
        if (message) {
          onSendMessage(message);
          input.value = "";
        }
      }}
      className="sticky bottom-0 bg-white border-t border-gray-200 p-4"
    >
      <div className="flex gap-2">
        <input
          type="text"
          name="message"
          placeholder="Write a message…"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 outline-none"
          autoFocus
        />
        <button
          type="submit"
          className="bg-[#635BFF] text-white rounded-full px-6 py-2 outline-none"
        >
          Send
        </button>
      </div>
    </form>
  );
}
