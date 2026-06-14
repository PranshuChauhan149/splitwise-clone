const MessageBubble = ({ message, currentUserId }) => {
  const isMine = message.sender?.id === currentUserId;
  const alignment = isMine ? "self-end bg-sky-600 text-white" : "self-start bg-slate-100 text-slate-900";

  return (
    <div className={`max-w-xl rounded-3xl p-4 shadow-sm ${alignment}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold">{message.sender?.name || "Unknown"}</p>
        <span className="text-xs text-slate-200">{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <p className="mt-2 text-sm leading-6">{message.content}</p>
    </div>
  );
};

export default MessageBubble;
