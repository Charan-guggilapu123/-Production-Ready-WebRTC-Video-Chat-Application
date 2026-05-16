'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
// Replaced external icon dependency with inline SVG to avoid missing package

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      setIsLoading(true);
      router.push(`/room/${roomId}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roomId.trim()) {
      handleJoinRoom();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="bg-blue-500 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              <path d="M23 7l-7 5 7 5V7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold">VideoChat</h1>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-2">Welcome</h2>
          <p className="text-gray-400 mb-8">
            Connect with multiple peers in real-time using WebRTC
          </p>

          {/* Create Room */}
          <div className="mb-6">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Create New Room
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Join Room */}
          <div>
            <label className="block text-sm font-medium mb-2">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter room ID to join"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              onClick={handleJoinRoom}
              disabled={!roomId.trim() || isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </button>
          </div>

          {/* Info */}
          <div className="mt-8 bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <strong>Features:</strong>
              <br />
              • Multi-peer video chat (up to 4 participants)
              <br />
              • Real-time text messaging
              <br />
              • Mute/Camera controls
              <br />
              • Responsive grid layout
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>
            Built with Next.js, WebRTC, Socket.IO
          </p>
        </div>
      </div>
    </div>
  );
}
