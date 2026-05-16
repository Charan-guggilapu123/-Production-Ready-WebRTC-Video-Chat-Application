'use client';

import React from 'react';
import { VideoContainer } from './VideoContainer';
import type { RemotePeer } from '@/app/hooks/useWebRTC';

interface VideoGridProps {
  localStream: MediaStream | null;
  remotePeers: RemotePeer[];
}

export const VideoGrid = ({ localStream, remotePeers }: VideoGridProps) => {
  const totalVideos = remotePeers.length + 1; // +1 for local video
  let gridClass = 'grid-cols-1';

  if (totalVideos === 2) gridClass = 'grid-cols-2';
  else if (totalVideos === 3) gridClass = 'grid-cols-2 xl:grid-cols-3';
  else if (totalVideos >= 4) gridClass = 'grid-cols-2 xl:grid-cols-4';

  return (
    <div
      className={`grid ${gridClass} gap-4 w-full h-full`}
      data-test-id="remote-video-container"
    >
      {/* Remote videos */}
      {remotePeers.map((peer) => (
        <div
          key={peer.id}
          className="w-full h-full rounded-lg overflow-hidden shadow-lg"
        >
          <VideoContainer stream={peer.stream} peerId={peer.id} />
        </div>
      ))}

      {/* Local video - Picture in Picture style if not alone */}
      {remotePeers.length > 0 ? (
        <div className="fixed bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-blue-500 z-50">
          <VideoContainer stream={localStream} isLocal={true} />
        </div>
      ) : (
        <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
          <VideoContainer stream={localStream} isLocal={true} />
        </div>
      )}
    </div>
  );
};
