'use client';

import {
    Container,
    Title,
    Text,
    Stack,
    SimpleGrid,
} from '@mantine/core';
import TicketCard from './TicketCard';

export default function BuyTicketsPage() {
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
        <Container py={80} size="md">
            <Stack align="center" gap="md" mb="xl">
                <Title order={2} c="blue.9" fw={800} ta="center">
                    Buy Tickets to Lido di Lugano
                </Title>
                <Text size="md" c="gray.7" ta="center" maw={500}>
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
    );
}
