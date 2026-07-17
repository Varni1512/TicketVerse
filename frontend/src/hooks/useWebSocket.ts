import { useEffect, useRef, useState } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());
  const token = localStorage.getItem('token');

  useEffect(() => {
    const client = new Client({
      // We use SockJS fallback because some older browsers/proxies don't support raw WebSocket
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      // Passing token for potential WS auth in the future
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      debug: (_str) => {
        // console.log(_str); // Uncomment for debugging STOMP frames
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket STOMP broker');
      setConnected(true);
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.onWebSocketClose = () => {
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [token]);

  const subscribe = (topic: string, callback: (message: any) => void) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.warn('Cannot subscribe, STOMP client not connected yet');
      // A robust implementation might queue subscriptions until connected
      return () => {};
    }

    // Only subscribe if not already subscribed
    if (!subscriptionsRef.current.has(topic)) {
      const sub = clientRef.current.subscribe(topic, (message: IMessage) => {
        if (message.body) {
          try {
            callback(JSON.parse(message.body));
          } catch (e) {
            callback(message.body);
          }
        }
      });
      subscriptionsRef.current.set(topic, sub);
    }

    return () => {
      const sub = subscriptionsRef.current.get(topic);
      if (sub) {
        sub.unsubscribe();
        subscriptionsRef.current.delete(topic);
      }
    };
  };

  return { connected, subscribe };
};
