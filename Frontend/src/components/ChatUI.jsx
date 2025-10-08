import React, { useState, useRef, useEffect } from "react";
import "./ChatUI.css";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hey! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message to backend
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      const botMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.answer || "Sorry, I couldn’t generate a response.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = {
        id: Date.now() + 2,
        role: "assistant",
        text: "⚠️ Error connecting to the server. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // ✅ Enter key to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatui-wrapper">
      <div className="chat-area">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
