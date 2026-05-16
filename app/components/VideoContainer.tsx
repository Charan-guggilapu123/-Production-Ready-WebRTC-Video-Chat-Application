'use client';

import { useEffect, useRef } from 'react';

interface VideoContainerProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  peerId?: string;
}

export const VideoContainer = ({ stream, isLocal = false, peerId }: VideoContainerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={`relative w-full h-full bg-black rounded-lg overflow-hidden ${isLocal ? 'border-2 border-blue-500' : ''}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        data-test-id={isLocal ? 'local-video' : 'remote-video'}
        className="w-full h-full object-cover"
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2"></div>
            <p className="text-sm">{peerId ? `${peerId.slice(0, 8)}...` : 'No stream'}</p>
          </div>
        </div>
      )}
    </div>
  );
};
