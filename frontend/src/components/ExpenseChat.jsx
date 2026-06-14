import { useEffect, useRef, useState } from "react";
import { expenseApi } from "../services/apiService.js";
import { initSocket } from "../services/socketService.js";
import MessageBubble from "./MessageBubble.jsx";

const ExpenseChat = ({ expenseId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await expenseApi.getExpenseMessages(expenseId);
        setMessages(response.data.data.messages || []);
      } catch (err) {
        setError(err.error || err.message || "Unable to load messages.");
      }
    };

    loadMessages();
  }, [expenseId]);

  useEffect(() => {
    const socketInstance = initSocket();
    socketRef.current = socketInstance;
    setConnected(false);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleReceiveMessage = (message) => {
      setMessages((current) => [...current, message]);
    };
    const handleConnectError = (err) => {
      setError(err?.message || "Unable to connect to chat.");
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("receive-message", handleReceiveMessage);
    socketInstance.on("connect_error", handleConnectError);

    socketInstance.emit("join-expense", { expenseId }, (response) => {
      if (!response?.success) {
        setError(response?.message || "Could not join expense chat.");
      }
    });

    return () => {
      socketInstance.off("receive-message", handleReceiveMessage);
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
    };
  }, [expenseId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const socket = socketRef.current;
    if (!content.trim() || !socket) return;

    setIsSending(true);
    setError(null);

    socket.emit("send-message", { expenseId, content: content.trim() }, (response) => {
      if (!response?.success) {
        setError(response?.message || "Unable to send message.");
      } else {
        setContent("");
      }
      setIsSending(false);
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Expense chat</h2>
          <p className="mt-2 text-sm text-slate-500">Discuss this expense with your group in realtime.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          {connected ? "Connected" : "Offline"}
        </div>
      </div>
      <div ref={scrollRef} className="mt-6 flex h-96 flex-col gap-3 overflow-y-auto rounded-3xl border border-slate-100 bg-slate-50 p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">No messages yet. Start the conversation here.</p>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
          ))
        )}
      </div>
      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={sendMessage}>
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Type a message..."
          className="min-h-[3rem] flex-1 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending}
          className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseChat;
