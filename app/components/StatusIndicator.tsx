'use client';

import React from 'react';
import { Loader, CheckCircle, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'waiting' | 'connecting' | 'connected';
}

export const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white">
      {status === 'waiting' && (
        <>
          <Clock data-test-id="status-waiting" size={20} className="text-yellow-500" />
          <span>Waiting for participants...</span>
        </>
      )}
      {status === 'connecting' && (
        <>
          <Loader
            data-test-id="status-connecting"
            size={20}
            className="text-blue-500 animate-spin"
          />
          <span>Connecting...</span>
        </>
      )}
      {status === 'connected' && (
        <>
          <CheckCircle
            data-test-id="status-connected"
            size={20}
            className="text-green-500"
          />
          <span>Connected</span>
        </>
      )}
    </div>
  );
};
