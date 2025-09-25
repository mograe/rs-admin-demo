import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Client = { id: string; name: string; ip: string; latency?: number; position?: number };

type Ctx = {
  connected: boolean;
  isConnecting: boolean;
  serverUrl: string;
  setServerUrl: (u: string) => void;
  clients: Client[];
  logs: string[];
  connect: () => void;
  disconnect: () => void;
  play: () => void;
  pause: () => void;
  prev: () => void;
  next: () => void;
  selectMovie: (movieId: string) => void;
};

const SocketCtx = createContext<Ctx | null>(null);
export const useSocket = () => {
  const v = useContext(SocketCtx);
  if (!v) throw new Error('useSocket must be inside <SocketProvider/>');
  return v;
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  // URL сервера: поменяйте на IP вашего сервера (планшет/роутер/Pi)
  const [serverUrl, setServerUrl] = useState('http://192.168.0.42:3001');
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const sockRef = useRef<Socket | null>(null);

  const log = (m: string) =>
    setLogs(p => [`[${new Date().toLocaleTimeString()}] ${m}`, ...p].slice(0, 200));

  const connect = () => {
    if (sockRef.current && (connected || isConnecting)) return;

    setIsConnecting(true);
    const socket = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: false,
    });

    sockRef.current = socket;

    socket.on('connect', () => { setConnected(true); setIsConnecting(false); log('connected');});
    socket.on('disconnect', (r) => { setConnected(false); log('disconnected:' +r);});
    socket.on('connect_error', (e) => {setIsConnecting(false); log('error: ' + e.message);});

    socket.on('clients', (list: Client[]) => setClients(list));
    socket.on('log', (line: string) => setLogs(p => [line, ...p].slice(0,200)));

    socket.connect();
  }

  const disconnect = () => {
    try {
      sockRef.current?.removeAllListeners();
      sockRef.current?.disconnect();
    } finally {
      sockRef.current = null;
      setConnected(false);
      setIsConnecting(false);
      setClients([]);
      log('manual disconnect');
    }
  };

  // команды
  const emit = (event: string, payload?: any) => sockRef.current?.emit(event, payload);
  const api: Ctx = useMemo(() => ({
      connected, isConnecting, serverUrl, setServerUrl, clients, logs,
      connect, disconnect,
      play:  () => emit('play'),
      pause: () => emit('pause'),
      prev:  () => emit('prev'),
      next:  () => emit('next'),
      selectMovie: (id: string) => emit('selectMovie', { id }),
    }), [connected, serverUrl, clients, logs]);

  return <SocketCtx.Provider value={api}>{children}</SocketCtx.Provider>;
}
