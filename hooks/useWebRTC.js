import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebRTC = (localVideoRef, remoteVideoRef, websocket, participantId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connections, setConnections] = useState(new Map());

  const peerConnections = useRef(new Map());
  const iceCandidateQueues = useRef(new Map());

  // ICE servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  // Initialize local media stream
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, [localVideoRef]);

  // Create peer connection for a participant
  const createPeerConnection = useCallback((targetParticipantId, stream) => {
    const peerConnection = new RTCPeerConnection(iceServers);

    // Add local stream tracks to peer connection
    if (stream) {
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
    }

    // Handle incoming stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote stream from:', targetParticipantId);
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => new Map(prev.set(targetParticipantId, remoteStream)));
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && websocket?.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'webrtc-ice-candidate',
          candidate: event.candidate,
          targetParticipant: targetParticipantId
        }));
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state with ${targetParticipantId}:`, peerConnection.connectionState);

      if (peerConnection.connectionState === 'disconnected' ||
        peerConnection.connectionState === 'failed') {
        cleanupPeerConnection(targetParticipantId);
      }
    };

    peerConnections.current.set(targetParticipantId, peerConnection);
    return peerConnection;
  }, [websocket]);

  // Create and send offer
  const createOffer = useCallback(async (targetParticipantId, stream) => {
    const peerConnection = createPeerConnection(targetParticipantId, stream);

    try {
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await peerConnection.setLocalDescription(offer);

      if (websocket?.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'webrtc-offer',
          offer: offer,
          targetParticipant: targetParticipantId
        }));
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [createPeerConnection, websocket]);

  // Handle incoming offer
  const handleOffer = useCallback(async (offer, fromParticipant, stream) => {
    const peerConnection = createPeerConnection(fromParticipant, stream);

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      // Process queued ICE candidates
      const queuedCandidates = iceCandidateQueues.current.get(fromParticipant) || [];
      for (const candidate of queuedCandidates) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
      iceCandidateQueues.current.delete(fromParticipant);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      if (websocket?.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'webrtc-answer',
          answer: answer,
          targetParticipant: fromParticipant
        }));
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [createPeerConnection, websocket]);

  // Handle incoming answer
  const handleAnswer = useCallback(async (answer, fromParticipant) => {
    const peerConnection = peerConnections.current.get(fromParticipant);
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

        // Process queued ICE candidates
        const queuedCandidates = iceCandidateQueues.current.get(fromParticipant) || [];
        for (const candidate of queuedCandidates) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        iceCandidateQueues.current.delete(fromParticipant);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }, []);

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate, fromParticipant) => {
    const peerConnection = peerConnections.current.get(fromParticipant);

    if (peerConnection && peerConnection.remoteDescription) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    } else {
      // Queue the candidate if remote description is not set yet
      if (!iceCandidateQueues.current.has(fromParticipant)) {
        iceCandidateQueues.current.set(fromParticipant, []);
      }
      iceCandidateQueues.current.get(fromParticipant).push(candidate);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);

        // Notify other participants
        if (websocket?.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'video-toggle',
            enabled: videoTrack.enabled
          }));
        }
      }
    }
  }, [localStream, websocket]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);

        // Notify other participants
        if (websocket?.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'audio-toggle',
            enabled: audioTrack.enabled
          }));
        }
      }
    }
  }, [localStream, websocket]);

  // Connect to new participant
  const connectToParticipant = useCallback(async (targetParticipantId) => {
    if (localStream && !peerConnections.current.has(targetParticipantId)) {
      await createOffer(targetParticipantId, localStream);
    }
  }, [localStream, createOffer]);

  // Cleanup peer connection
  const cleanupPeerConnection = useCallback((participantId) => {
    const peerConnection = peerConnections.current.get(participantId);
    if (peerConnection) {
      peerConnection.close();
      peerConnections.current.delete(participantId);
    }

    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(participantId);
      return newMap;
    });

    iceCandidateQueues.current.delete(participantId);
  }, []);

  // Cleanup all connections
  const cleanup = useCallback(() => {
    // Close all peer connections
    peerConnections.current.forEach((peerConnection, participantId) => {
      peerConnection.close();
    });
    peerConnections.current.clear();
    iceCandidateQueues.current.clear();

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    setRemoteStreams(new Map());
    setLocalStream(null);
  }, [localStream]);

  return {
    localStream,
    remoteStreams,
    isVideoEnabled,
    isAudioEnabled,
    initializeLocalStream,
    connectToParticipant,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    toggleVideo,
    toggleAudio,
    cleanupPeerConnection,
    cleanup
  };
};
