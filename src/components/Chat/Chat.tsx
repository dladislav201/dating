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
  const [image, setImage] = useState<File | null>(null);
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
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setImage(null);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim() && !image) return;

    const messageData = {
      senderId,
      receiverId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      imgUrl: "",
    };

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch(
        "http://localhost:3001/api/messages/img/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error(errorData.error);
        return;
      }

      const uploadData = await uploadRes.json();
      messageData.imgUrl = uploadData.imgUrl;
    }

    // send msg by WebSocket
    socket.emit("sendMessage", messageData);

    // save msg in db
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });

    setNewMessage("");
    setImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
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
                {msg.content && (
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
                )}
                {msg.imgUrl && (
                  <div
                    className={classNames(
                      "chat__message-image",
                      msg.senderId === senderId
                        ? "chat__message-image--sent"
                        : "chat__message-image--received"
                    )}
                  >
                    <img src={msg.imgUrl} alt="message-image" />
                  </div>
                )}
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
            <input
              type="file"
              accept="image/*"
              className="chat__input-file"
              onChange={handleImageChange}
            />
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
