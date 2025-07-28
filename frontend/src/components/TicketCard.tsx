'use client';

import { Card, Stack, Group, Title, Text, Button } from '@mantine/core';
import { FaTicketAlt } from 'react-icons/fa';

type TicketCardProps = {
    title: string;
    description: string;
    price: string;
    onClick: () => void;
    loading?: boolean;
};

export default function TicketCard({ title, description, price, onClick, loading }: TicketCardProps) {
    return (
        <Card
            shadow="md"
            padding="lg"
            radius="md"
            withBorder
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
        >
            <Stack gap="sm">
                <Group justify="space-between">
                    <Title order={4}>{title}</Title>
                </Group>
                <Text size="sm" c="black" style={{ flexGrow: 1 }}>
                    {description}
                </Text>
                <Text fw={700} size="lg" c="blue.8">
                    {price}
                </Text>
                <Button
                    leftSection={<FaTicketAlt size={24} />}
                    fullWidth
                    radius="md"
                    variant="filled"
                    color="blue"
                    onClick={onClick}
                    loading={loading}
                >
                    Buy Now
                </Button>
            </Stack>
        </Card>
    );
}