'use client';

import { User } from '@/models/user';
import api from '@/util/api';
import {
    AppShell,
    AppShellHeader,
    Title,
    Button,
    Modal,
    Stack,
    Text,
    Group,
    Menu,
    Avatar,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { get } from 'http';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import useWebSocket from 'react-use-websocket';

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [modalOpened, setModalOpened] = useState(false);
    const [loginUrl, setLoginUrl] = useState('');

    const websocketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

    const { sendMessage, lastMessage } = useWebSocket(websocketUrl, {
        onOpen: () => {
            getLoginUrl();
        },
        shouldReconnect: () => true,
    });

    // create a function to do the url request
    const getLoginUrl = useCallback(() => {
        sendMessage(JSON.stringify({ type: 'get-login-url', payload: null }));
    }, [sendMessage]);

    const router = useRouter();

    const goToHome = () => {
        router.push('/');
    };

    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('sessionToken');
            const pubKey = localStorage.getItem('sessionPubKey');
            if (!token || !pubKey) {
                return;
            }
            const response = await api.get<User>('me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Pubkey': pubKey,
                },
            });

            if (!response.ok) {
                return;
            }
            const user = await response.json();
            setUserName(user.display_name || user.name || 'User');
            setProfilePicture(user.picture || '');
        } catch (err) {
            console.log('Error fetching user:', err);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionPubKey');
        setUserName('');
        setProfilePicture('');
        getLoginUrl();
    };

    useEffect(() => {
        const token = localStorage.getItem('sessionToken');
        const pubKey = localStorage.getItem('sessionPubKey');
        if (token && pubKey) {
            fetchUser();
        }
    }, [fetchUser]);

    useEffect(() => {
        if (!lastMessage) return;
        try {
            const data = JSON.parse(lastMessage.data);
            if (data?.type === 'login-url' && data.payload?.loginUrl) {
                setLoginUrl(data.payload.loginUrl);
            } else if (data?.type === 'login-approved') {
                const token = data.payload?.token;
                const pubKey = data.payload?.pubkey;
                if (token && pubKey) {
                    localStorage.setItem('sessionToken', token);
                    localStorage.setItem('sessionPubKey', pubKey);
                    setModalOpened(false);
                    fetchUser();
                }
            } else if (data?.type === 'login-declined') {
                console.log('Login declined:',);
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('sessionPubKey');
                notifications.show({
                    title: 'Login Declined',
                    message: 'Your login request was declined. Please try again.',
                    color: 'red',
                });
                // request a new login URL
                getLoginUrl();
            }
        } catch (err) {
            console.error('Invalid message received:', err);
        }
    }, [lastMessage, fetchUser]);

    return (
        <>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Accedi"
                centered
                size="sm"
            >
                <Stack align="center" gap="sm">
                    <Text size="sm">Scan the QR code to login</Text>
                    <QRCodeSVG value={loginUrl} size={150} />
                    <Text size="xs" c="gray.6">
                        Or click below to login from this device
                    </Text>
                    <Button
                        c="white"
                        bg={'black'}
                        leftSection={
                            <img src="portal.svg" alt="logo" style={{ width: 24, height: 24 }} />
                        }
                        fullWidth
                        onClick={() => {
                            window.location.href = loginUrl;
                        }}
                    >
                        Login with Portal
                    </Button>
                </Stack>
            </Modal>
            <AppShell header={{ height: 60 }} padding="none">
                <AppShellHeader
                    withBorder
                    px="md"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Title order={3} c="blue.9" onClick={goToHome} style={{ cursor: 'pointer' }}>
                        Lido di Lugano
                    </Title>
                    {userName && profilePicture ? (
                        <Menu shadow="md" width={180} position="bottom-end">
                            <Menu.Target>
                                <Button variant="light" rightSection={
                                    <Avatar src={profilePicture} size={24} radius="xl" />
                                }>
                                    {userName}
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    color='red'
                                    leftSection={<FiLogOut size={16} />}
                                    onClick={logout}
                                >
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    ) : (
                        <Button
                            variant="light"
                            rightSection={<FaUser size={18} />}
                            onClick={() => setModalOpened(true)}
                        >
                            Login
                        </Button>
                    )}
                </AppShellHeader>
                <AppShell.Main>
                    {children}
                </AppShell.Main>
            </AppShell>
        </>
    );
}
