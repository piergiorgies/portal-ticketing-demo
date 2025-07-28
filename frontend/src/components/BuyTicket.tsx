'use client';

import {
    Container,
    Title,
    Text,
    Stack,
    SimpleGrid,
} from '@mantine/core';
import TicketCard from './TicketCard';
import { useEffect, useRef } from 'react';

export default function BuyTicketsPage() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5; // Slow down to 50% speed
        }
    }, []);

    const handleBuyClick = (ticketType: string) => {
        console.log(`Buying ticket: ${ticketType}`);
    };

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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 40% black overlay
                    zIndex: -1,
                }}
            />

            <Container py={80} size="md">
                <Stack align="center" gap="md" mb="xl">
                    <Title
                        order={2}
                        c="blue.9"
                        fw={800}
                        ta="center"
                        style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)' }}
                    >
                        Buy Tickets to Lido di Lugano
                    </Title>
                    <Text size="md" c="white" ta="center" maw={600}>
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
                        />
                    ))}
                </SimpleGrid>
            </Container>
        </div>
    );
}
