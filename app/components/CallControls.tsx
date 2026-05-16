'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

interface CallControlsProps {
  onMuteMic: (muted: boolean) => void;
  onToggleCamera: (enabled: boolean) => void;
  onHangup: () => void;
}

export const CallControls = ({
  onMuteMic,
  onToggleCamera,
  onHangup,
}: CallControlsProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const handleMuteMic = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    onMuteMic(!newMuted);
  };

  const handleToggleCamera = () => {
    const newCameraOff = !isCameraOff;
    setIsCameraOff(newCameraOff);
    onToggleCamera(!newCameraOff);
  };

  const handleHangup = () => {
    onHangup();
  };

  return (
    <div className="flex gap-4 justify-center items-center">
      {/* Mute Microphone Button */}
      <button
        onClick={handleMuteMic}
        data-test-id="mute-mic-button"
        className={`p-3 rounded-full transition-all ${
          isMuted
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg`}
        title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      {/* Toggle Camera Button */}
      <button
        onClick={handleToggleCamera}
        data-test-id="toggle-camera-button"
        className={`p-3 rounded-full transition-all ${
          isCameraOff
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg`}
        title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
      >
        {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
      </button>

      {/* Hangup Button */}
      <button
        onClick={handleHangup}
        data-test-id="hangup-button"
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all"
        title="End call"
      >
        <Phone size={24} />
      </button>
    </div>
  );
};
