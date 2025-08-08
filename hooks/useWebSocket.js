import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('Connected');
        setSocket(ws);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('Disconnected');
        setSocket(null);

        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);

          console.log(`Attempting to reconnect in ${timeout}ms (attempt ${reconnectAttempts.current})`);
          setConnectionStatus(`Reconnecting in ${timeout / 1000}s...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, timeout);
        } else {
          setConnectionStatus('Connection failed');
        }
      };

      ws.onerror = (error) => {
        // Don't log WebSocket errors to console as they're expected when server is not running
        setConnectionStatus('Offline');
      };

      return ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionStatus('Error');
      return null;
    }
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
      return false;
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socket) {
      socket.close(1000, 'Manual disconnect');
    }

    setSocket(null);
    setConnectionStatus('Disconnected');
    reconnectAttempts.current = 0;
  }, [socket]);

  // Contest-specific methods
  const subscribeToStats = useCallback(() => {
    return sendMessage({ type: 'subscribe-stats' });
  }, [sendMessage]);

  const unsubscribeFromStats = useCallback(() => {
    return sendMessage({ type: 'unsubscribe-stats' });
  }, [sendMessage]);

  const subscribeToContest = useCallback((contestId) => {
    return sendMessage({ type: 'subscribe-contest', contestId });
  }, [sendMessage]);

  const unsubscribeFromContest = useCallback((contestId) => {
    return sendMessage({ type: 'unsubscribe-contest', contestId });
  }, [sendMessage]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    socket,
    connectionStatus,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect,
    subscribeToStats,
    unsubscribeFromStats,
    subscribeToContest,
    unsubscribeFromContest
  };
};
