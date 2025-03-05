"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Message } from "@/models";
import classNames from "classnames";
import { formatTime, formatDate } from "@/utils";
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      handleInput();
    }
  }, []);

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
      setNewMessage("");
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId,
      receiverId,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    // send msg by WebSocket
    socket.emit("sendMessage", messageData);

    // save msg in db
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });
  };

  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__box">
          {messages.map((msg, index) => {
            const showDate =
              index === 0 ||
              new Date(msg.createdAt).toDateString() !==
                new Date(messages[index - 1]?.createdAt).toDateString();

            return (
              <div key={index}>
                {showDate && (
                  <div className="chat__date">
                    <p className="chat__date-value">
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                )}
                <div
                  className={classNames(
                    "chat__message",
                    msg.senderId === senderId
                      ? "chat__message--sent"
                      : "chat__message--received"
                  )}
                >
                  <p className="chat__message-value">{msg.content}</p>
                  <p className="chat__message-time">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chat__input">
          <div className="chat__input-island">
            <textarea
              rows={1}
              ref={textareaRef}
              onInput={handleInput}
              value={newMessage}
              className="chat__input-field"
              style={{
                lineHeight:
                  newMessage.trim().split("\n").length === 1
                    ? "30px"
                    : "normal",
              }}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <div className="chat__input-btn-wrapper">
              <Button variant="primary" size="small" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="chat__curtain">
        <div className="chat__curtain-blur">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="chat__curtain-gradient"></div>
      </div>
    </div>
  );
};
