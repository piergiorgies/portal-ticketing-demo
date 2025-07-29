import { env } from "../config/env.ts";
import { PortalDeamon } from "./portal-deamon.ts";


const staticToken = 'tornello1'
export async function startBurnProcess() {
    const client = await PortalDeamon.getClient()
    await client.newKeyHandshakeUrl(async(mainKey) => {
        await handleBurnRequest(mainKey)

        startBurnProcess();
    }, staticToken);
}

export async function handleBurnRequest(mainKey: string) {
    const client = await PortalDeamon.getClient()
    const requestCashuResponse = await client.requestCashu(mainKey, [], env.CASHU_URL, 'lido', 1);
    if(requestCashuResponse.status === 'success') {
        await client.burnCashu(env.CASHU_URL, 'lido', requestCashuResponse.token, env.CASHU_TOKEN);
    }
}