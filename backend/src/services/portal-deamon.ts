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
        await this.client.setProfile({
            id: '',
            pubkey: '',
            about: '',
            display_name: '',
            name: ''
        })
    }
}
