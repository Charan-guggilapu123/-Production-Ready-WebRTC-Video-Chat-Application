'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

export const useChat = (socket: Socket | null, roomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageIdRef = useRef(0);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !message.trim()) return;

      socket.emit('chat-message', {
        roomId,
        message: message.trim(),
        sender: socket.id,
      });
    },
    [socket, roomId]
  );

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = ({
      sender,
      message,
      timestamp,
    }: {
      sender: string;
      message: string;
      timestamp: string;
    }) => {
      const id = `${messageIdRef.current++}`;
      setMessages((prev) => [
        ...prev,
        {
          id,
          sender,
          message,
          timestamp,
        },
      ]);
    };

    socket.on('chat-message', handleChatMessage);

    return () => {
      socket.off('chat-message');
    };
  }, [socket]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    messageIdRef.current = 0;
  }, []);

  return { messages, sendMessage, clearMessages };
};
