'use client';

import {
    Container,
    Title,
    Text,
    Stack,
    Card,
    Badge,
    ScrollArea,
    Group,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import useWebSocket from 'react-use-websocket';
import './admin.css';
type BurnFailPayload = { status: string };
type BurnSuccessPayload = { ticketName: string };

type LogEntry = {
    type: string;
    payload: BurnFailPayload | BurnSuccessPayload | Record<string, any>;
    timestamp: string;
};

export default function AdminPage() {
    const [websocketUrl, setWebsocketUrl] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [logMessages, setLogMessages] = useState<LogEntry[]>([]);
    const [highlighted, setHighlighted] = useState<Set<string>>(new Set());

    useEffect(() => {
        const token = localStorage.getItem('sessionToken');
        const pubKey = localStorage.getItem('sessionPubKey');

        if (token && pubKey) {
            setIsLoggedIn(true);
            const baseUrl = process.env.NEXT_PUBLIC_ADMIN_WS_URL || 'ws://localhost:8000/admin/ws';
            const fullUrl = `${baseUrl}?token=${encodeURIComponent(token)}&pubKey=${encodeURIComponent(pubKey)}`;
            setWebsocketUrl(fullUrl);
        } else {
            setIsLoggedIn(false);
        }

        const savedLogs = localStorage.getItem('adminMessageLog');
        if (savedLogs) {
            try {
                const parsed: LogEntry[] = JSON.parse(savedLogs);
                setLogMessages(parsed);
            } catch (err) {
                console.log('Failed to parse saved logs:', err);
            }
        }
    }, []);

    const { lastMessage } = useWebSocket(websocketUrl ?? null, {
        onOpen: () => {
            console.log('WebSocket connection established');
        },
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (!lastMessage) return;

        try {
            const data = JSON.parse(lastMessage.data);
            const timestamp = new Date().toISOString(); // use ISO for unique ID
            const logEntry: LogEntry = {
                type: data.type || 'unknown',
                payload: data.payload || {},
                timestamp,
            };

            const updatedLogs = [logEntry, ...logMessages].slice(0, 100);
            setLogMessages(updatedLogs);
            localStorage.setItem('adminMessageLog', JSON.stringify(updatedLogs));

            // Highlight effect
            setHighlighted((prev) => new Set(prev).add(timestamp));
            setTimeout(() => {
                setHighlighted((prev) => {
                    const next = new Set(prev);
                    next.delete(timestamp);
                    return next;
                });
            }, 5000);
        } catch (err) {
            console.log('Invalid WebSocket message:', err);
        }
    }, [lastMessage]);

    const renderLogMessage = (msg: LogEntry) => {
        switch (msg.type) {
            case 'burn-success':
                return (
                    <>
                        <Text c="green" fw={500}><FaCheck /> Ticket Used Successfully</Text>
                        <Text size="sm">Ticket: <strong>{(msg.payload as BurnSuccessPayload).ticketName}</strong></Text>
                    </>
                );
            case 'burn-fail':
                return (
                    <>
                        <Text c="red" fw={500}><FaTimes /> Burn Failed</Text>
                        <Text size="sm">Reason: <strong>{(msg.payload as BurnFailPayload).status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</strong></Text>
                    </>
                );
            default:
                return (
                    <Text size="sm">
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(msg.payload, null, 2)}
                        </pre>
                    </Text>
                );
        }
    };

    return (
        <Container py={80}>
            <Stack>
                <Title order={1}>Admin Page</Title>
                <Text>Welcome to the admin page. Here you can manage tickets and users.</Text>

                {isLoggedIn ? (
                    <Text c="green">You are logged in as an admin.</Text>
                ) : (
                    <Text c="red">You are not logged in. Please log in to access admin features.</Text>
                )}

                <Title order={3} mt="lg">Message Log</Title>

                <ScrollArea h={400}>
                    <Stack>
                        {logMessages.length === 0 && (
                            <Text size="sm" c="dimmed">No messages yet.</Text>
                        )}
                        {logMessages.map((msg, index) => (
                            <Card
                                key={msg.timestamp}
                                shadow="sm"
                                padding="sm"
                                radius="md"
                                withBorder
                                className={highlighted.has(msg.timestamp) ? 'lightning' : ''}
                            >
                                <Stack gap={4}>
                                    <Group justify="space-between">
                                        <Badge
                                            color={
                                                msg.type === 'burn-success'
                                                    ? 'green'
                                                    : msg.type === 'burn-fail'
                                                        ? 'red'
                                                        : 'gray'
                                            }
                                        >
                                            {msg.type === 'burn-success'
                                                ? 'Valid'
                                                : msg.type === 'burn-fail'
                                                    ? 'Expired'
                                                    : 'Log Message'}
                                        </Badge>
                                        <Text size="xs" c="dimmed">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </Text>
                                    </Group>

                                    {renderLogMessage(msg)}
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </ScrollArea>
            </Stack>
        </Container>
    );
}
