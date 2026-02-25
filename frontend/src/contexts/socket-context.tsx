import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';

interface SocketContextType {
    socket: Socket | null;
    onlines: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlines, setOnlines] = useState<string[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            socket?.disconnect();
            setSocket(null);
            return;
        }

        // Khởi tạo socket mới với token
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

        setSocket(newSocket);

        return () => {
            // newSocket.removeAllListeners();
            newSocket.disconnect();
        };
    }, [token, isAuthenticated]);

    return <SocketContext.Provider value={{ socket, onlines }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
    return ctx;
};
