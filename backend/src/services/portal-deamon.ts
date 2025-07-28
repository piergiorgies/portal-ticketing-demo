import { PortalSDK } from 'portal-sdk'

import { env } from '../config/env.js'

export class PortalDeamon {
    private static instance: PortalDeamon | null = null

    private readonly client: PortalSDK

    private constructor() {
        this.client = new PortalSDK({
            serverUrl: 'ws://localhost:3000/ws',
            connectTimeout: 10000,
        })
    }

    public static async getClient(): Promise<PortalSDK> {
        if (!PortalDeamon.instance) {
            PortalDeamon.instance = new PortalDeamon()
            await PortalDeamon.instance.init()
        }

        return PortalDeamon.instance.client
    }

    async init() {
        await this.client.connect()
        await this.client.authenticate(env.AUTH_TOKEN)
        console.log('PortalDeamon client initialized')
        await this.client.setProfile({
            id: '',
            pubkey: '',
            display_name: 'Lido di Lugano',
            name: 'Lido di Lugano',
            picture:
                'https://images.unsplash.com/photo-1494947356691-434358cea5a3?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=annie-spratt-03SU9tzAHvY-unsplash.jpg&w=640',
        })
        console.log('Profile set for PortalDeamon client')
    }
}
