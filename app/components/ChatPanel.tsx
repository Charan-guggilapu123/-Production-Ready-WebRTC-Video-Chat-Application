'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/app/hooks/useChat';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export const ChatPanel = ({ messages, onSendMessage }: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700">
      {/* Chat Log */}
      <div
        data-test-id="chat-log"
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No messages yet. Start chatting!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              data-test-id="chat-message"
              className="bg-gray-800 rounded p-3"
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-blue-400 text-sm">
                  {msg.sender.slice(0, 8)}...
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-200 text-sm mt-1">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-700 p-3 bg-gray-800"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            data-test-id="chat-input"
            className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            data-test-id="chat-submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
