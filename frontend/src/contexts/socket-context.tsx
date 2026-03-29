import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { useCall } from './call-context';

interface SocketContextType {
  socket: Socket | null;
  onlines: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated } = useAuth();
  const { callStatus, setCallStatus, setIncomingCall } =
    useCall();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlines, setOnlines] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const newSocket = io(import.meta.env.VITE_APP_SOCKET_URL, {
      auth: { token },
      autoConnect: true,
    });

    newSocket.on('online-list', (list: string[]) => {
      setOnlines(list);
    });

    newSocket.on('user-online', ({ userId }) => {
      setOnlines((prev) => [...new Set([...prev, userId])]);
    });

    newSocket.on('user-offline', ({ userId }) => {
      setOnlines((prev) => prev.filter((id) => id !== userId));
    });

    newSocket.on('ringing', (data) => {
      if (callStatus !== 'idle') {
        newSocket.emit('call-busy');
        return;
      }

      setCallStatus('ringing')
      setIncomingCall(data);
    });

    newSocket.on('callee-accept', () => {
      setCallStatus('in-call')
    })

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, onlines }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
  return ctx;
};
