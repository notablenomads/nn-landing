import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { io, Socket } from "socket.io-client";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type MessageStatus = "sending" | "sent" | "error" | null;

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  type: "text" | "notification";
  status: MessageStatus;
}

interface StreamResponse {
  success: boolean;
  chunk?: string;
  error?: string;
}

const SOCKET_URL = "https://api.production.platform.notablenomads.com/chat";

interface Props {
  onClose?: () => void;
  className?: string;
}

const ChatComponent: React.FC<Props> = ({
  onClose = () => {},
  className = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>(
    "Not connected"
  );
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const initializeWebSocket = () => {
    if (socket) {
      socket.disconnect();
    }

    setConnectionStatus("Connecting...");
    setIsProcessing(true);
    setError("");

    console.log("Initializing WebSocket connection to:", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully");
      setConnectionStatus("Connected");
      setIsProcessing(false);
      setError("");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setConnectionStatus("Disconnected");
      setIsProcessing(true);
    });

    newSocket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
      setConnectionStatus(`Connection error`);
      setError(`Failed to connect: ${error.message}`);
      setIsProcessing(true);
    });

    newSocket.on("streamChunk", (data: StreamResponse) => {
      console.log("Received stream chunk:", data);
      if (data.success && data.chunk) {
        appendAIMessage(data.chunk);
        setIsTyping(true);
      }
    });

    newSocket.on("streamComplete", () => {
      console.log("Stream completed");
      setConnectionStatus("Connected");
      setIsProcessing(false);
      setIsTyping(false);

      // Update the last user message status to 'sent'
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastUserMessageIndex = [...updatedMessages]
          .reverse()
          .findIndex((msg) => msg.sender === "user");

        if (lastUserMessageIndex !== -1) {
          const actualIndex = updatedMessages.length - 1 - lastUserMessageIndex;
          updatedMessages[actualIndex] = {
            ...updatedMessages[actualIndex],
            status: "sent",
          };
        }
        return updatedMessages;
      });

      // Focus input after a short delay to ensure state updates are complete
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    });

    newSocket.on("streamError", (data: StreamResponse) => {
      console.error("Stream error received:", data);
      setError(data.error || "An error occurred while processing your message");
      setIsProcessing(false);
      setIsTyping(false);

      // Update the last user message status to 'error'
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastUserMessageIndex = [...updatedMessages]
          .reverse()
          .findIndex((msg) => msg.sender === "user");

        if (lastUserMessageIndex !== -1) {
          const actualIndex = updatedMessages.length - 1 - lastUserMessageIndex;
          updatedMessages[actualIndex] = {
            ...updatedMessages[actualIndex],
            status: "error",
          };
        }

        return [
          ...updatedMessages,
          {
            id: Date.now(),
            content:
              "Sorry, I encountered an error processing your message. Please try again.",
            sender: "bot",
            timestamp: new Date().toISOString(),
            type: "text",
            status: "error",
          },
        ];
      });
    });

    setSocket(newSocket);
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const appendAIMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (
        lastMessage &&
        lastMessage.sender === "bot" &&
        lastMessage.status !== "error"
      ) {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + text,
          status: "sent",
        };
        return updatedMessages;
      } else {
        return [
          ...prevMessages,
          {
            id: Date.now(),
            content: text,
            sender: "bot",
            timestamp: new Date().toISOString(),
            type: "text",
            status: "sent",
          },
        ];
      }
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isProcessing || !socket) return;

    setError("");
    const messageId = Date.now();

    const userMessage: Message = {
      id: messageId,
      content: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sending",
      type: "text",
    };

    try {
      console.log("Sending message:", {
        message: newMessage.trim(),
        messageId,
      });

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      setIsTyping(true);
      setIsProcessing(true);

      socket.emit("startStream", {
        message: newMessage.trim(),
        messageId,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  interface MessageBubbleProps {
    message: Message;
  }

  const handleRetry = (message: Message) => {
    if (!socket) return;
    setError("");

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === message.id
          ? { ...msg, status: "sending" as MessageStatus }
          : msg
      )
    );

    // Remove the error message if it exists
    setMessages((prevMessages) =>
      prevMessages.filter(
        (msg) =>
          !(
            msg.sender === "bot" &&
            msg.status === "error" &&
            msg.content.includes("Sorry, I encountered an error")
          )
      )
    );

    setIsTyping(true);
    setIsProcessing(true);

    // Resend the message
    socket.emit("startStream", {
      message: message.content,
      messageId: message.id,
    });
  };

  const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isError = message.status === "error";

    return (
      <div
        className={`flex ${
          message.sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex gap-2 max-w-[80%] min-w-[40px] ${
            message.sender === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
            <AvatarFallback
              className={`${
                message.sender === "user"
                  ? "bg-zinc-700"
                  : isError
                  ? "bg-red-700"
                  : "bg-zinc-700"
              } 
                                      text-zinc-200 text-xs md:text-sm`}
            >
              {message.sender === "user" ? "U" : "B"}
            </AvatarFallback>
          </Avatar>
          <div
            className={`rounded-lg p-3 break-words ${
              message.sender === "user"
                ? "bg-secondary text-secondary-foreground"
                : isError
                ? "bg-red-900/20 text-red-200 border border-red-900"
                : "bg-zinc-800 text-zinc-100"
            }`}
          >
            <p className="text-md whitespace-pre-wrap">{message.content}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-100 opacity-75">
                {formatTime(message.timestamp)}
              </span>
              {message.status === "sending" && (
                <Loader2 className="h-3 w-3 animate-spin text-zinc-300" />
              )}
              {isError && message.sender === "user" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => handleRetry(message)}
                  disabled={
                    isProcessing || !socket || connectionStatus !== "Connected"
                  }
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`sm:h-[600px] mx-auto dark ${className}`}
      style={{
        width: 550,
        maxWidth: "100%",
        maxHeight: isMobile ? "calc(100dvh - 98px)" : 400,
      }}
    >
      <Card className="h-full flex flex-col bg-zinc-900 border-zinc-800 rounded-none sm:rounded-lg">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-zinc-700 text-zinc-200">
                <Image
                  src="/logo/new-nn-logo-dark.svg"
                  width={32}
                  height={32}
                  alt="nn-avatar"
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-zinc-100">
                Ask us anything ...
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "Connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                <span className="text-xs text-zinc-400">
                  {connectionStatus}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mx-4 mt-4 w-2/3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CardContent className="flex-1 p-2 sm:p-4 flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Avatar className="h-6 w-6 md:h-8 md:w-8">
                    <AvatarFallback className="bg-zinc-700 text-zinc-200">
                      B
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-zinc-800 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <form
            onSubmit={handleSendMessage}
            className="mt-4 flex gap-2 pt-2 border-t border-zinc-800"
          >
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              disabled={
                isProcessing || !socket || connectionStatus !== "Connected"
              }
            />
            <Button
              type="submit"
              size="icon"
              className="bg-secondary hover:bg-secondary/90 flex-shrink-0"
              disabled={
                !newMessage.trim() ||
                isProcessing ||
                !socket ||
                connectionStatus !== "Connected"
              }
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatComponent;
