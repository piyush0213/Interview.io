import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { BsChatDots } from "react-icons/bs";
import io from "socket.io-client";
import { useStore } from "../store/store.js";
const API_URL = import.meta.env.VITE_API_URL;

const socket = io.connect(`${API_URL}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const Chat = () => {
  const { user } = useStore();

  const [messages, setMessages] = useState([]); // Messages array for the chatbox
  const [messageInput, setMessageInput] = useState(""); // Input for the chatbox

  const chatboxRef = useRef(); // Ref for the chatbox
  const [role, setRole] = useState(user.role);
  console.log(role);
  const [chatType, setChatType] = useState("conversation");

  useEffect(() => {
    // Handle receiving messages from server
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Me", text: messageInput },
      ]);
      socket.emit("send-chat-message", messageInput);
      setMessageInput("");
    }
  };

  const handleSendMessageToBot = () => {
    console.log("Sending message to bot");
  };

  return (
    <>
      <div
        ref={chatboxRef}
        className="chat-section py-4 px-4 flex flex-col flex-1 border rounded-xl shadow-md shadow-[#e7e9ec] mx-4"
      >
        <div className="chat-tabs flex mb-[20px] gap-3">
          <button
            onClick={() => setChatType("conversation")}
            className={`${
              chatType === "conversation"
                ? `active bg-[#ff7b47] text-white`
                : `inactive bg-[#e0e0e0] text-[#333]`
            } px-6 py-2 rounded-md`}
          >
            Conversation
          </button>
          <button
            onClick={() => setChatType("chatbot")}
            disabled={role !== "interviewer"}
            className={`${
              role === "interviewer" ? "cursor-pointer" : "cursor-no-drop"
            } ${
              chatType === "chatbot"
                ? `active bg-[#ff7b47] text-white`
                : `inactive bg-[#e0e0e0] text-[#333]`
            } px-6 py-2 rounded-md`}
          >
            AI Chatbot
          </button>
        </div>

        {chatType === "conversation" && (
          <div className="chat-window flex flex-col bg-[#f5f7fa] h-[50vh] mb-[20px] overflow-y-scroll text-[#333]">
            {messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={`flex ${
                    msg.user === "Me" ? "justify-end" : "justify-start"
                  } flex-col`}
                >
                  <div
                    className={`my-4 mx-4 p-2 rounded-md border ${
                      msg.user === "Me"
                        ? "bg-[#ff7b47] text-white self-end"
                        : "bg-white self-start"
                    }`}
                  >
                    <strong>{msg.user}: </strong>
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {chatType === "chatbot" && (
          <div className="chat-window flex flex-col bg-[#f5f7fa] h-[50vh] mb-[20px] overflow-y-scroll text-[#333]">
            <div className="chat flex flex-col">
              <div className="chatbot-message flex flex-col items-start">
                <span className="material-symbols-outlined">smart_toy</span>
                <p>Hi! I'm the AI Chatbot. How can I help you today?</p>
              </div>
            </div>
          </div>
        )}

        <div className="input-section flex gap-2">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="px-4 py-2 border w-[25vw] rounded-md"
            type="text"
            placeholder="Type your answer here..."
          />
          <button
            onClick={() => {
              chatType == "conversation"
                ? handleSendMessage()
                : handleSendMessageToBot();
            }