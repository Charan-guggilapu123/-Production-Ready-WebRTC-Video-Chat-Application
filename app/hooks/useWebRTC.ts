'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';

export interface RemotePeer {
  id: string;
  stream?: MediaStream;
  peerConnection?: RTCPeerConnection;
}

export interface UseWebRTCOptions {
  socket: Socket | null;
  roomId: string;
  onRemotePeerAdded?: (peer: RemotePeer) => void;
  onRemotePeerRemoved?: (peerId: string) => void;
  onStatusChange?: (status: 'waiting' | 'connecting' | 'connected') => void;
}

const STUN_SERVERS = [
  { urls: process.env.NEXT_PUBLIC_STUN_SERVER || 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export const useWebRTC = ({
  socket,
  roomId,
  onRemotePeerAdded,
  onRemotePeerRemoved,
  onStatusChange,
}: UseWebRTCOptions) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const [status, setStatus] = useState<'waiting' | 'connecting' | 'connected'>('waiting');
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);

  const updateStatus = useCallback((newStatus: typeof status) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const createPeerConnection = useCallback(
    (peerId: string): RTCPeerConnection => {
      const peerConnection = new RTCPeerConnection({
        iceServers: STUN_SERVERS,
      });

      // Add local tracks to the connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current!);
        });
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice-candidate', {
            to: peerId,
            candidate: event.candidate,
          });
        }
      };

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('Remote track received:', event.track.kind);
        remoteStreamsRef.current.set(peerId, event.streams[0]);

        setRemotePeers((prev) => {
          const existing = prev.find((p) => p.id === peerId);
          if (existing) {
            return prev.map((p) =>
              p.id === peerId ? { ...p, stream: event.streams[0] } : p
            );
          }
          const newPeer: RemotePeer = {
            id: peerId,
            stream: event.streams[0],
            peerConnection,
          };
          onRemotePeerAdded?.(newPeer);
          return [...prev, newPeer];
        });

        // Update status if we have a remote peer
        updateStatus('connected');
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (
          peerConnection.connectionState === 'failed' ||
          peerConnection.connectionState === 'disconnected'
        ) {
          closePeerConnection(peerId);
        }
      };

      // Handle ICE connection state
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
      };

      peerConnectionsRef.current.set(peerId, peerConnection);
      return peerConnection;
    },
    [socket, onRemotePeerAdded, updateStatus]
  );

  const closePeerConnection = useCallback((peerId: string) => {
    const peerConnection = peerConnectionsRef.current.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      peerConnectionsRef.current.delete(peerId);
    }

    remoteStreamsRef.current.delete(peerId);
    setRemotePeers((prev) => prev.filter((p) => p.id !== peerId));
    onRemotePeerRemoved?.(peerId);

    // Update status if no more peers
    if (peerConnectionsRef.current.size === 0) {
      updateStatus('waiting');
    }
  }, [onRemotePeerRemoved, updateStatus]);

  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  const joinRoom = useCallback(async () => {
    if (!socket) return;

    // Initialize local stream
    await initializeLocalStream();

    // Send join-room event
    socket.emit('join-room', { roomId });
  }, [socket, roomId, initializeLocalStream]);

  const sendOffer = useCallback(
    async (peerId: string) => {
      if (!socket) return;

      const peerConnection = createPeerConnection(peerId);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit('offer', {
        to: peerId,
        offer,
      });

      updateStatus('connecting');
    },
    [socket, createPeerConnection, updateStatus]
  );

  const handleOffer = useCallback(
    async (from: string, offer: RTCSessionDescriptionInit) => {
      if (!socket) return;

      let peerConnection = peerConnectionsRef.current.get(from);
      if (!peerConnection) {
        peerConnection = createPeerConnection(from);
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit('answer', {
        to: from,
        answer,
      });

      updateStatus('connecting');
    },
    [socket, createPeerConnection, updateStatus]
  );

  const handleAnswer = useCallback(async (from: string, answer: RTCSessionDescriptionInit) => {
    const peerConnection = peerConnectionsRef.current.get(from);
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  const handleIceCandidate = useCallback(
    async (from: string, candidate: RTCIceCandidateInit) => {
      const peerConnection = peerConnectionsRef.current.get(from);
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    },
    []
  );

  const toggleAudio = useCallback((enabled: boolean) => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }, []);

  const toggleVideo = useCallback((enabled: boolean) => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }, []);

  const hangup = useCallback(() => {
    // Close all peer connections
    peerConnectionsRef.current.forEach((peerConnection) => {
      peerConnection.close();
    });
    peerConnectionsRef.current.clear();

    // Stop all local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    // Disconnect socket
    if (socket) {
      socket.disconnect();
    }

    setRemotePeers([]);
    updateStatus('waiting');
  }, [socket, updateStatus]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('peers', ({ peers }: { peers: string[] }) => {
      console.log('Existing peers:', peers);
      // Create offers for each existing peer
      peers.forEach((peerId) => {
        sendOffer(peerId);
      });
      if (peers.length === 0) {
        updateStatus('waiting');
      } else {
        updateStatus('connecting');
      }
    });

    socket.on('user-joined', ({ userId }: { userId: string }) => {
      console.log('User joined:', userId);
      // We'll receive an offer from the new user
      updateStatus('connecting');
    });

    socket.on('offer', ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log('Received offer from:', from);
      handleOffer(from, offer);
    });

    socket.on(
      'answer',
      ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
        console.log('Received answer from:', from);
        handleAnswer(from, answer);
      }
    );

    socket.on(
      'ice-candidate',
      ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
        handleIceCandidate(from, candidate);
      }
    );

    socket.on('user-left', ({ userId }: { userId: string }) => {
      console.log('User left:', userId);
      closePeerConnection(userId);
    });

    return () => {
      socket.off('peers');
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
    };
  }, [socket, sendOffer, handleOffer, handleAnswer, handleIceCandidate, closePeerConnection, updateStatus]);

  return {
    localStream: localStreamRef.current,
    remotePeers,
    status,
    joinRoom,
    toggleAudio,
    toggleVideo,
    hangup,
  };
};
