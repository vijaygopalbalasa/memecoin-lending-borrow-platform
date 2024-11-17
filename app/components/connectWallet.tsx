// components/WalletConnect.tsx
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { Button } from '@/app/components/ui/button';
import { Wallet, AlertTriangle } from 'lucide-react';

export const WalletConnect = () => {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();

    const [displayAddress, setDisplayAddress] = useState<string>('');

    useEffect(() => {
        if (address) {
            setDisplayAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
        }
    }, [address]);

    const handleConnect = async () => {
        try {
            const connector = connectors[0];
            if (connector) {
                await connect({ connector });
            }
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {chainId !== 14 && isConnected && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 bg-red-50 rounded-md">
                    <AlertTriangle className="h-4 w-4" />
                    Switch to Flare Network
                </div>
            )}
            
            {isConnected ? (
                <Button
                    variant="outline"
                    onClick={() => disconnect()}
                    className="flex items-center gap-2"
                >
                    <Wallet className="h-4 w-4" />
                    {displayAddress}
                </Button>
            ) : (
                <Button
                    onClick={handleConnect}
                    className="flex items-center gap-2"
                >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                </Button>
            )}
        </div>
    );
};

export default WalletConnect;