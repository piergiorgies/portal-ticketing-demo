'use client';

import {
    Container,
    Title,
    Text,
    Stack,
    SimpleGrid,
} from '@mantine/core';
import TicketCard from './TicketCard';
import { useEffect, useRef, useState } from 'react';
import { useLoginModal } from '@/context/LoginModalContext';
import { showNotification } from '@mantine/notifications';

export default function BuyTicketsPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { openLoginModal, makePaymentRequest, lastMessage } = useLoginModal();
    const [loadingType, setLoadingType] = useState<string | null>(null);
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8;
        }
    }, []);

    const handleBuyClick = (ticketType: string) => {
        const token = localStorage.getItem('sessionToken');
        const pubKey = localStorage.getItem('sessionPubKey');
        if (!token || !pubKey) {
            openLoginModal();
            return;
        }
        setLoadingType(ticketType);
        makePaymentRequest(ticketType, pubKey);
    };

    useEffect(() => {
        if (!lastMessage) return;

        try {
            const data = JSON.parse(lastMessage.data);
            if (data.type === 'single-payment') {
                if (data.payload.status === 'paid') {
                    setLoadingType(null);
                    showNotification({
                        title: 'Payment Successful',
                        message: `Your payment has been processed successfully.`,
                        color: 'green',
                    })
                }
            }
        } catch (error) {
            console.log('Error parsing lastMessage:', error);
            setLoadingType(null);
            showNotification({
                title: 'Error',
                message: 'An error occurred while processing your payment. Please try again.',
                color: 'red',
            });
        }
    }, [lastMessage]);

    const tickets = [
        {
            title: 'Adult Entrance',
            description: 'Valid for one adult (18+). All-day access to the beach and pool area.',
            price: 'CHF 10.00',
            type: 'adult',
        },
        {
            title: 'Child Entrance',
            description: 'For children under 12. Includes supervised play area access.',
            price: 'CHF 5.00',
            type: 'child',
        },
        {
            title: 'Family Pass',
            description: 'Up to 2 adults + 2 children. Full-day access to all areas.',
            price: 'CHF 25.00',
            type: 'family',
        },
    ];

    return (
        <div style={{ position: 'relative', zIndex: 0 }}>
            <video
                ref={videoRef}
                controls={false}
                disablePictureInPicture
                autoPlay
                muted
                loop
                playsInline
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    zIndex: -2,
                }}
            >
                <source src="/back-video.mp4" type="video/mp4" />
            </video>

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(2px)',
                    zIndex: -1,
                }}
            />

            <Container py={80} size="md">
                <Stack
                    align="center"
                    gap="md"
                    mb="xl"
                    p="xl"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Title order={2} c="blue.6" fw={800} ta="center">
                        Buy Tickets to Lido di Lugano
                    </Title>
                    <Text size="md" c="black" ta="center" maw={600}>
                        Choose the best ticket option for you and enjoy a day of sun, water, and fun on Lake Lugano!
                    </Text>
                </Stack>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {tickets.map((ticket) => (
                        <TicketCard
                            key={ticket.type}
                            title={ticket.title}
                            description={ticket.description}
                            price={ticket.price}
                            onClick={() => handleBuyClick(ticket.type)}
                            loading={loadingType === ticket.type}
                        />
                    ))}
                </SimpleGrid>
            </Container>
        </div>
    );
}
