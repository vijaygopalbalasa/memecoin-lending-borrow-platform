import { useState, useEffect } from 'react';
import { ArrowRight, Info, AlertTriangle } from 'lucide-react';

export default function Deposit() {
    const [mode, setMode] = useState('deposit'); // 'deposit' or 'withdraw'
    const [amount, setAmount] = useState('');
    const [selectedMemecoin, setSelectedMemecoin] = useState('DOGE');

    // User position from smart contract
    const [userData, setUserData] = useState({
        collateralAmount: 0,
        depositTimestamp: 0,
        collateralValue: 0
    });

    const memecoins = [
        {
            symbol: 'DOGE',
            name: 'Dogecoin',
            icon: '🐕',
            price: '$0.08',
            change: '+5.2%',
            balance: '10,000',
            collateralValue: '$800',
            maxLTV: '60%'
        },
        {
            symbol: 'SHIB',
            name: 'Shiba Inu',
            icon: '🐕',
            price: '$0.00001',
            change: '+3.1%',
            balance: '1,000,000',
            collateralValue: '$1,000',
            maxLTV: '60%'
        },
        {
            symbol: 'PEPE',
            name: 'Pepe',
            icon: '🐸',
            price: '$0.000001',
            change: '+7.8%',
            balance: '5,000,000',
            collateralValue: '$500',
            maxLTV: '60%'
        }
    ];

    // Calculate collateral value based on current memecoin price
    const calculateCollateralValue = (amount, symbol) => {
        const coin = memecoins.find(c => c.symbol === symbol);
        const price = parseFloat(coin.price.replace('$', ''));
        return amount * price;
    };

    // Calculate maximum borrowable amount (60% of collateral value)
    const calculateMaxBorrow = (collateralValue) => {
        return (collateralValue * 60) / 100;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header with Tabs */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Deposit Collateral</h1>
                    <p className="text-gray-400">Deposit your memecoins as collateral to borrow stablecoins</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-1">
                    <button
                        onClick={() => setMode('deposit')}
                        className={`px-4 py-2 rounded-lg transition-all ${mode === 'deposit'
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => setMode('withdraw')}
                        className={`px-4 py-2 rounded-lg transition-all ${mode === 'withdraw'
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Current Position Card */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Your Collateral Position</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Total Collateral</p>
                        <p className="text-2xl font-bold">
                            {userData.collateralAmount.toLocaleString()} {selectedMemecoin}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Collateral Value</p>
                        <p className="text-2xl font-bold">
                            ${userData.collateralValue.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Max Borrowable</p>
                        <p className="text-2xl font-bold text-primary-400">
                            ${calculateMaxBorrow(userData.collateralValue).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Memecoin Selection */}
            <div className="grid gap-4 mb-8">
                <h3 className="text-lg font-semibold">Select Memecoin</h3>
                {memecoins.map((coin) => (
                    <button
                        key={coin.symbol}
                        onClick={() => setSelectedMemecoin(coin.symbol)}
                        className={`p-6 rounded-xl border transition-all ${selectedMemecoin === coin.symbol
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center text-2xl mr-4">
                                    {coin.icon}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">{coin.symbol}</h3>
                                        <span className="text-sm text-gray-400">{coin.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-sm text-gray-400">Price: {coin.price}</span>
                                        <span className="text-sm text-green-400">{coin.change}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold">Balance: {coin.balance}</div>
                                <div className="text-sm text-gray-400">Value: {coin.collateralValue}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Amount Input */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 mb-8">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                        {mode === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
                    </label>
                    <button
                        onClick={() => {
                            const coin = memecoins.find(c => c.symbol === selectedMemecoin);
                            setAmount(mode === 'deposit' ? coin.balance : userData.collateralAmount.toString());
                        }}
                        className="text-sm text-primary-400 hover:text-primary-300"
                    >
                        Max
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-900 rounded-lg border-gray-700 pr-20"
                        placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-gray-400">{selectedMemecoin}</span>
                    </div>
                </div>
            </div>

            {/* Collateral Calculator */}
            {mode === 'deposit' && amount && (
                <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Collateral Overview</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Collateral Value</span>
                            <span>
                                ${calculateCollateralValue(parseFloat(amount) || 0, selectedMemecoin).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Maximum Borrowable (60%)</span>
                            <span className="text-primary-400">
                                ${(calculateCollateralValue(parseFloat(amount) || 0, selectedMemecoin) * 0.6).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Liquidation Threshold</span>
                            <span className="text-yellow-400">150%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Button */}
            <button
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all flex items-center justify-center group"
                disabled={!amount}
            >
                {mode === 'deposit' ? 'Deposit' : 'Withdraw'} {selectedMemecoin}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-yellow-400">
                        {mode === 'deposit'
                            ? 'Deposited memecoins will be used as collateral. Maintain a healthy collateral ratio to avoid liquidation.'
                            : 'You can only withdraw collateral that is not being used to back active loans.'}
                    </p>
                </div>
            </div>
        </div>
    );
}