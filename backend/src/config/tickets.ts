export type Ticket = {
    title: string
    description: string
    price: number
    priceInMillisats: number
    type: 'adult' | 'child' | 'family'
}

export const TICKETS: Ticket[] = [
    {
        title: 'Adult Entrance',
        description:
            'Valid for one adult (18+). All-day access to the beach and pool area.',
        price: 10,
        priceInMillisats: 10000,
        type: 'adult',
    },
    {
        title: 'Child Entrance',
        description:
            'For children under 12. Includes supervised play area access.',
        price: 5,
        priceInMillisats: 5000,
        type: 'child',
    },
    {
        title: 'Family Pass',
        description:
            'Up to 2 adults + 2 children. Full-day access to all areas.',
        price: 25,
        priceInMillisats: 25000,
        type: 'family',
    },
]
