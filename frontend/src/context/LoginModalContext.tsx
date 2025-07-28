// context/LoginModalContext.tsx
'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

type LoginModalContextType = {
    openLoginModal: () => void;
    closeLoginModal: () => void;
    isOpen: boolean;
    setError: (msg: string) => void;
    error: string;
    sendMessage: (msg: string) => void;
    lastMessage: MessageEvent | null;
    readyState: ReadyState;
    getLoginUrl: () => void;
    makePaymentRequest: (ticketType: string, pubkey: string) => void;
};

const LoginModalContext = createContext<LoginModalContextType | null>(null);

export const useLoginModal = () => {
    const ctx = useContext(LoginModalContext);
    if (!ctx) throw new Error('useLoginModal must be used within LoginModalProvider');
    return ctx;
};

export const LoginModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const websocketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

    const { sendMessage, lastMessage, readyState } = useWebSocket(websocketUrl, {
        onOpen: () => {
            getLoginUrl();
        },
        shouldReconnect: () => true,
    });

    const getLoginUrl = useCallback(() => {
        sendMessage(JSON.stringify({ type: 'get-login-url', payload: null }));
    }, [sendMessage]);

    const makePaymentRequest = useCallback((ticketType: string, pubkey: string) => {
        sendMessage(JSON.stringify({
            type: 'get-single-payment',
            payload: {
                type: ticketType,
                pubkey,
            },
        }));
    }, [sendMessage]);

    const openLoginModal = () => {
        setError('');
        setIsOpen(true);
    };

    const closeLoginModal = () => {
        setIsOpen(false);
        setError('');
    };

    return (
        <LoginModalContext.Provider
            value={{
                isOpen,
                openLoginModal,
                closeLoginModal,
                error,
                setError,
                sendMessage,
                lastMessage,
                readyState,
                getLoginUrl,
                makePaymentRequest,
            }}
        >
            {children}
        </LoginModalContext.Provider>
    );
};
