'use client';

import { WagmiProvider as Provider } from 'wagmi';
import { config } from '../config/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </Provider>
    );
}