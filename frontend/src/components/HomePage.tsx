'use client';

import { Carousel } from '@mantine/carousel';
import {
    Button,
    Container,
    Text,
    Title,
    Stack,
    Box,
} from '@mantine/core';
import { useRouter } from 'next/navigation';

const carouselImages = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
];


export default function HomePage() {
    const router = useRouter();
    const goToBuy = () => {
        router.push('/buy');
    };

    return (
        <Box style={{ minHeight: '100vh', backgroundColor: '#f8fbff' }}>
            <Box pos="relative" h="100vh" w="100%" style={{ overflow: 'hidden' }}>
                <Carousel
                    withIndicators
                    height="100vh"
                    slideSize="100%"
                    slideGap={0}
                    controlSize={40}
                    styles={{
                        indicator: {
                            backgroundColor: 'white',
                            opacity: 0.7,
                        },
                    }}
                    emblaOptions={{ loop: true }}
                >
                    {carouselImages.map((src, index) => (
                        <Carousel.Slide key={index}>
                            <img
                                src={src}
                                alt={`Slide ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100vh',
                                    objectFit: 'cover',
                                }}
                            />
                        </Carousel.Slide>
                    ))}
                </Carousel>

                <Box
                    pos="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        background: 'rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <Stack align="center" gap="md" px="md" style={{ pointerEvents: 'auto' }}>
                        <Title order={1} c="white" fw={900} ta="center">
                            Welcome to Lido di Lugano
                        </Title>
                        <Text size="lg" c="gray.2" ta="center" maw={600}>
                            Relax, sun, and fun on the shores of Lake Lugano.
                        </Text>
                    </Stack>
                </Box>
            </Box>

            <Box bg="blue.0" py={80}>
                <Container size="sm">
                    <Stack align="center" gap="lg">
                        <Title order={2} c="blue.9" fw={700}>
                            Discover our summer activities
                        </Title>
                        <Text ta="center" c="gray.8" maw={500}>
                            Swimming pools, equipped beaches, water sports, and much more await you.
                        </Text>
                        <Button size="lg" variant="filled" color="blue" radius="xl" onClick={goToBuy}>
                            Buy tickets now
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box >
    );
}
