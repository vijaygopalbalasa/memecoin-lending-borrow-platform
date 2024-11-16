// src/components/UserProfile.jsx
import { useState } from 'react';
import useWeb3Auth from '../hooks/useWeb3Auth';

export default function UserProfile() {
    const {
        user,
        address,
        openWalletUI,
        openFiatOnRamp,
        transferTokens,
        logout
    } = useWeb3Auth();

    const [transferAmount, setTransferAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');

    const handleTransfer = async () => {
        try {
            await transferTokens(recipientAddress, transferAmount);
            // Show success notification
        } catch (error) {
            // Show error notification
        }
    };

    return (
        <div className="p-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Welcome, {user?.name}</h3>
                    <p className="text-sm text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                </div>
                <img
                    src={user?.profileImage}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={openWalletUI}
                    className="p-3 bg-primary-500/20 rounded-lg hover:bg-primary-500/30 transition-colors"
                >
                    Open Wallet
                </button>
                <button
                    onClick={openFiatOnRamp}
                    className="p-3 bg-secondary-500/20 rounded-lg hover:bg-secondary-500/30 transition-colors"
                >
                    Buy Crypto
                </button>
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Send To</label>
                    <input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="w-full bg-gray-900 rounded-lg"
                        placeholder="0x..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                        type="text"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full bg-gray-900 rounded-lg"
                        placeholder="0.0"
                    />
                </div>
                <button
                    onClick={handleTransfer}
                    className="w-full p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all"
                >
                    Send
                </button>
            </div>

            <button
                onClick={logout}
                className="w-full p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
                Disconnect
            </button>
        </div>
    );
}