// app/config/wagmi.ts
import {  createConfig } from 'wagmi'
import {  http } from 'viem'

// Define Flare network
export const flareChain = {
    id: 14,
    name: 'Flare',
    network: 'flare',
    nativeCurrency: {
        decimals: 18,
        name: 'Flare',
        symbol: 'FLR',
    },
    rpcUrls: {
        public: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
        default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Flare Explorer', url: 'https://flare-explorer.flare.network' },
    },
} as const;

// Create wagmi config
export const config = createConfig({
    chains: [flareChain],
    transports: {
        [flareChain.id]: http(flareChain.rpcUrls.public.http[0])
    },
})