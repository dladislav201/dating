"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Message } from "@/models";
import classNames from "classnames";
import "./Chat.scss";
import { Button } from "../Button";

const socket = io("http://localhost:3001"); // "https://production-server.com" in prod

interface ChatProps {
  senderId: string;
  receiverId: string;
}

export const Chat = ({ senderId, receiverId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // get msg histroy
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/messages?senderId=${senderId}&receiverId=${receiverId}`
      );
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();

    // listen new msg WebSocket
    socket.on("receiveMessage", (message) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = { senderId, receiverId, content: newMessage };

    // send msg by WebSocket
    socket.emit("sendMessage", messageData);

    // save msg in db
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });

    setNewMessage("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat">
        <div className="chatbox">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={classNames(
                "message",
                msg.senderId === senderId ? "sent" : "received"
              )}
            >
              {msg.content}
            </p>
          ))}
        </div>
        <div className="input-wrapper">
          <div className="input-island">
            <input
              type="text"
              value={newMessage}
              className="input"
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <div className="input-btn-wrapper">
              <Button type="primary" size="small" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
