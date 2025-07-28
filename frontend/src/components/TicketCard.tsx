'use client';

import { Card, Stack, Group, Title, Text, Button } from '@mantine/core';
import { FaTicketAlt } from 'react-icons/fa';

type TicketCardProps = {
    title: string;
    description: string;
    price: string;
    onClick: () => void;
};

export default function TicketCard({ title, description, price, onClick }: TicketCardProps) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="sm">
                <Group justify="space-between">
                    <Title order={4}>{title}</Title>
                </Group>
                <Text size="sm" c="gray.6">
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
                >
                    Buy Now
                </Button>
            </Stack>
        </Card>
    );
}
