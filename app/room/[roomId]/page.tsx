'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/app/hooks/useSocket';
import { useWebRTC } from '@/app/hooks/useWebRTC';
import { useChat } from '@/app/hooks/useChat';
import { VideoGrid } from '@/app/components/VideoGrid';
import { CallControls } from '@/app/components/CallControls';
import { StatusIndicator } from '@/app/components/StatusIndicator';
import { ChatPanel } from '@/app/components/ChatPanel';

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter();
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { localStream, remotePeers, status, joinRoom, toggleAudio, toggleVideo, hangup } =
    useWebRTC({
      socket,
      roomId: params.roomId,
      onStatusChange: (newStatus) => {
        console.log('Status changed:', newStatus);
      },
    });

  const { messages, sendMessage } = useChat(socket, params.roomId);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        if (socket) {
          await joinRoom();
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize call');
        setIsLoading(false);
      }
    };

    if (socket) {
      initializeCall();
    }
  }, [socket, joinRoom]);

  const handleHangup = () => {
    hangup();
    router.push('/');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Video Chat</h1>
          <p className="text-sm text-gray-400">Room: {params.roomId}</p>
        </div>
        <StatusIndicator status={status} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <VideoGrid localStream={localStream} remotePeers={remotePeers} />
          </div>

          {/* Controls */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <CallControls
              onMuteMic={(muted) => toggleAudio(muted)}
              onToggleCamera={(enabled) => toggleVideo(enabled)}
              onHangup={handleHangup}
            />
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
          <ChatPanel messages={messages} onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}
