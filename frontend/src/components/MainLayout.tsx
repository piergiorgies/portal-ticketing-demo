'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import copy from 'copy-to-clipboard';

import api from '@/util/api';
import { User } from '@/models/user';
import {
    AppShell,
    AppShellHeader,
    Title,
    Button,
    Modal,
    Stack,
    Text,
    Menu,
    Avatar,
} from '@mantine/core';
import { FaCheckCircle, FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

import {
    LoginModalProvider,
    useLoginModal,
} from '@/context/LoginModalContext';

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
    return (
        <LoginModalProvider>
            <AppShellLayoutInner>{children}</AppShellLayoutInner>
        </LoginModalProvider>
    );
}

function AppShellLayoutInner({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState('');
    const [profilePicture, setProfilePicture] = useState('default-user.png');
    const [loginUrl, setLoginUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const {
        isOpen,
        openLoginModal,
        closeLoginModal,
        setError,
        error,
        sendMessage,
        lastMessage,
        getLoginUrl,
    } = useLoginModal();
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('sessionToken');
            const pubKey = localStorage.getItem('sessionPubKey');
            if (!token || !pubKey) return;

            const response = await api.get<User>('me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Pubkey': pubKey,
                },
            });

            if (!response.ok) return;

            const user = await response.json();
            setUserName(user.display_name || user.name || 'User');
            setProfilePicture(user.picture || 'default-user.png');
            if (user.isAdmin === true) {
                router.push('/admin');
            }

        } catch (err) {
            console.error('Error fetching user:', err);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionPubKey');
        setUserName('');
        setProfilePicture('');
        getLoginUrl();
    };

    const goToHome = () => router.push('/');

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
                    closeLoginModal();
                    fetchUser();
                }
            } else if (data?.type === 'login-declined') {
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('sessionPubKey');
                setError('Login was declined. Please try again.');
                getLoginUrl(); // Refresh QR code
            }
        } catch (err) {
            console.error('Invalid WebSocket message:', err);
        }
    }, [lastMessage, fetchUser, setError, closeLoginModal, getLoginUrl]);

    return (
        <>
            <Modal
                opened={isOpen}
                onClose={closeLoginModal}
                title="Accedi"
                centered
                size="sm"
            >
                <Stack align="center" gap="sm">
                    <Text size="sm">Scan the QR code to login</Text>
                    <div
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                            width: 150,
                            height: 150,
                        }}
                        onClick={() => {
                            const copied = copy(loginUrl);
                            if (copied) {
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1500);
                            } else {
                                window.prompt("Copy the login URL:", loginUrl);
                            }
                        }}
                    >
                        <QRCodeSVG value={loginUrl} size={150} />
                        {copied && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 8,
                                }}
                            >
                                <FaCheckCircle size={48} color="green" />
                            </div>
                        )}
                    </div>
                    <Text size="xs" c="gray.6">
                        Or click below to login from this device
                    </Text>
                    <Button
                        c="white"
                        bg={'black'}
                        leftSection={<img src="portal.svg" alt="logo" style={{ width: 24, height: 24 }} />}
                        fullWidth
                        onClick={() => {
                            window.location.href = loginUrl;
                        }}
                    >
                        Login with Portal
                    </Button>
                    {error && (
                        <Text size="sm" c="red" ta="center">
                            {error}
                        </Text>
                    )}
                </Stack>
            </Modal>

            <AppShell header={{ height: 60 }} padding="none">
                <AppShellHeader
                    withBorder
                    px="md"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Title
                        order={3}
                        c="blue.9"
                        onClick={goToHome}
                        style={{ cursor: 'pointer' }}
                    >
                        Lido di Lugano
                    </Title>

                    {userName && profilePicture ? (
                        <Menu shadow="md" width={180} position="bottom-end">
                            <Menu.Target>
                                <Button
                                    variant="light"
                                    rightSection={<Avatar src={profilePicture} size={24} radius="xl" />}
                                >
                                    {userName}
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    color="red"
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
                            onClick={openLoginModal}
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
