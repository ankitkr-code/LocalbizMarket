import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const starterMessages = [
  { from: "bot", text: "Ask me about business discovery, wallet activity, or investment risk." }
];

export default function Chatbot() {
  const [messages, setMessages] = useState(starterMessages);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { getToken } = useAuth();

  async function handleSend(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessage("");
    setIsSending(true);
    setMessages((current) => [...current, { from: "user", text }]);

    try {
      const response = await api("/chatbot/ask", {
        method: "POST",
        body: JSON.stringify({ message: text }),
        getToken
      });
      setMessages((current) => [...current, { from: "bot", text: response.answer }]);
    } catch (error) {
      setMessages((current) => [...current, { from: "bot", text: error.message }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5">
        <h1 className="section-title">AI Chatbot</h1>
        <p className="mt-2 text-slate-600">Backend-ready chat surface for DeepSeek or Hugging Face integration.</p>
      </div>
      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 p-4 font-semibold">
          <Bot size={20} /> Localbiz Assistant
        </div>
        <div className="grid min-h-64 gap-3 p-4">
          {messages.map((item, index) => (
            <div key={`${item.from}-${index}`} className={item.from === "user" ? "justify-self-end" : "justify-self-start"}>
              <p className={item.from === "user" ? "chat-user" : "chat-bot"}>{item.text}</p>
            </div>
          ))}
          {isSending && <p className="chat-bot justify-self-start">Thinking...</p>}
        </div>
        <form className="flex gap-2 border-t border-slate-200 p-4" onSubmit={handleSend}>
          <input className="field" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a question" />
          <button className="btn-primary grid aspect-square w-10 place-items-center p-0" type="submit" aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}
