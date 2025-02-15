import React, { useEffect, useState, useRef } from "react";
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
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const chatboxRef = useRef();
  const [role, setRole] = useState(user.role);
  const [chatType, setChatType] = useState("conversation");

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("receive-file", (file) => {
      setMessages((prevMessages) => [...prevMessages, file]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("receive-file");
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const message = { user: "Me", text: messageInput };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit("send-chat-message", message);
      setMessageInput("");
    }
  };

  const handleSendFile = () => {
    if (selectedFile) {
      const fileData = {
        user: "Me",
        fileName: selectedFile.name,
        fileURL: URL.createObjectURL(selectedFile),
      };
      setMessages((prevMessages) => [...prevMessages, fileData]);
      socket.emit("send-file", fileData);
      setSelectedFile(null);
    }
  };

  return (
    <div ref={chatboxRef} className="chat-section py-4 px-4 flex flex-col flex-1 border rounded-xl shadow-md mx-4">
      <div className="chat-tabs flex mb-[20px] gap-3">
        <button
          onClick={() => setChatType("conversation")}
          className={`${chatType === "conversation" ? "bg-[#ff7b47] text-white" : "bg-[#e0e0e0] text-[#333]"} px-6 py-2 rounded-md`}
        >
          Conversation
        </button>
        <button
          onClick={() => setChatType("chatbot")}
          disabled={role !== "interviewer"}
          className={`${role === "interviewer" ? "cursor-pointer" : "cursor-no-drop"} ${chatType === "chatbot" ? "bg-[#ff7b47] text-white" : "bg-[#e0e0e0] text-[#333]"} px-6 py-2 rounded-md`}
        >
          AI Chatbot
        </button>
      </div>

      <div className="chat-window flex flex-col bg-[#f5f7fa] h-[50vh] mb-[20px] overflow-y-scroll text-[#333]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.user === "Me" ? "justify-end" : "justify-start"} flex-col`}>
            {msg.text && (
              <div className={`my-4 mx-4 p-2 rounded-md border ${msg.user === "Me" ? "bg-[#ff7b47] text-white self-end" : "bg-white self-start"}`}>
                <strong>{msg.user}: </strong>
                <span>{msg.text}</span>
              </div>
            )}
            {msg.fileURL && (
              <div className="my-4 mx-4 p-2 rounded-md border bg-[#e3f2fd] self-start">
                <strong>{msg.user} sent a file:</strong>
                <a href={msg.fileURL} download={msg.fileName} className="text-blue-600 underline ml-2">
                  {msg.fileName}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="input-section flex gap-2">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="px-4 py-2 border w-[20vw] rounded-md"
          type="text"
          placeholder="Type your message..."
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="bg-[#e0e0e0] px-4 py-2 rounded-md cursor-pointer">Attach File</label>
        <button onClick={handleSendMessage} className="bg-[#ff7b47] px-4 py-2 text-white rounded-md">Send</button>
        <button onClick={handleSendFile} disabled={!selectedFile} className="bg-[#4caf50] px-4 py-2 text-white rounded-md disabled:opacity-50">Send File</button>
      </div>
    </div>
  );
};

export default Chat;
