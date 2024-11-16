import { useState, useEffect } from 'react';
import { ArrowRight, Info, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Borrow() {
    const [mode, setMode] = useState('borrow'); // 'borrow' or 'repay'
    const [borrowAmount, setBorrowAmount] = useState('');
    const [selectedStablecoin, setSelectedStablecoin] = useState('USDC');

    // User's position from smart contract
    const [position, setPosition] = useState({
        collateralAmount: 1000, // Example DOGE amount
        collateralValue: 80, // $80 worth of DOGE
        borrowedAmount: 30, // $30 USDC
        borrowTimestamp: Date.now() / 1000 - 86400, // 1 day ago
        healthFactor: 180 // 180%
    });

    const CONTRACT_CONSTANTS = {
        INTEREST_RATE: 10, // 10% annual interest rate for borrowing
        COLLATERALIZATION_RATIO: 166, // 166% required collateral ratio
        LIQUIDATION_RATIO: 150, // 150% liquidation threshold
        MAX_LTV: 60 // 60% maximum loan-to-value
    };

    const stablecoins = [
        {
            symbol: 'USDC',
            name: 'USD Coin',
            icon: '💵',
            price: '$1.00',
            liquidity: '$500,000',
            borrowed: '$100,000'
        },
        {
            symbol: 'USDT',
            name: 'Tether',
            icon: '💵',
            price: '$1.00',
            liquidity: '$300,000',
            borrowed: '$80,000'
        },
        {
            symbol: 'DAI',
            name: 'Dai',
            icon: '💵',
            price: '$1.00',
            liquidity: '$200,000',
            borrowed: '$50,000'
        }
    ];

    // Calculate interest based on smart contract formula
    const calculateInterest = (amount, timestamp) => {
        if (!amount || !timestamp) return 0;
        const timeElapsed = (Date.now() / 1000) - timestamp;
        return (amount * CONTRACT_CONSTANTS.INTEREST_RATE * timeElapsed) / (365 * 24 * 60 * 60 * 100);
    };

    // Calculate maximum borrowable amount based on collateral
    const calculateMaxBorrow = () => {
        return (position.collateralValue * CONTRACT_CONSTANTS.MAX_LTV) / 100;
    };

    // Calculate health factor
    const calculateHealthFactor = (borrow = position.borrowedAmount) => {
        if (!borrow) return 0;
        return (position.collateralValue / borrow) * 100;
    };

    // Get health factor status and color
    const getHealthFactorStatus = (factor) => {
        if (factor >= CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO) {
            return { color: 'text-green-400', status: 'Safe' };
        } else if (factor >= CONTRACT_CONSTANTS.LIQUIDATION_RATIO) {
            return { color: 'text-yellow-400', status: 'Warning' };
        }
        return { color: 'text-red-400', status: 'Danger' };
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header with Tabs */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Borrow Stablecoins</h1>
                    <p className="text-gray-400">Borrow stablecoins against your memecoin collateral</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-1">
                    <button
                        onClick={() => setMode('borrow')}
                        className={`px-4 py-2 rounded-lg transition-all ${mode === 'borrow'
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Borrow
                    </button>
                    <button
                        onClick={() => setMode('repay')}
                        className={`px-4 py-2 rounded-lg transition-all ${mode === 'repay'
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Repay
                    </button>
                </div>
            </div>

            {/* Position Overview */}
            {position.borrowedAmount > 0 && (
                <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Your Position</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Collateral Value</p>
                            <p className="text-2xl font-bold">${position.collateralValue}</p>
                            <p className="text-sm text-gray-400">
                                {position.collateralAmount.toLocaleString()} DOGE
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Borrowed Amount</p>
                            <p className="text-2xl font-bold">${position.borrowedAmount}</p>
                            <p className="text-sm text-gray-400">
                                + ${calculateInterest(position.borrowedAmount, position.borrowTimestamp).toFixed(2)} interest
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Health Factor</p>
                            <p className={`text-2xl font-bold ${getHealthFactorStatus(position.healthFactor).color}`}>
                                {position.healthFactor}%
                            </p>
                            <p className="text-sm text-gray-400">{getHealthFactorStatus(position.healthFactor).status}</p>
                        </div>
                    </div>

                    {/* Health Factor Indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Position Health</span>
                            <span className={`text-sm ${getHealthFactorStatus(position.healthFactor).color}`}>
                                {getHealthFactorStatus(position.healthFactor).status}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${position.healthFactor >= CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO
                                    ? 'bg-green-500'
                                    : position.healthFactor >= CONTRACT_CONSTANTS.LIQUIDATION_RATIO
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                style={{
                                    width: `${Math.min((position.healthFactor / CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO) * 100, 100)}%`
                                }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>Liquidation ({CONTRACT_CONSTANTS.LIQUIDATION_RATIO}%)</span>
                            <span>Min Safe ({CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO}%)</span>
                        </div>
                    </div>
                </div>
            )}

            {mode === 'borrow' ? (
                <>
                    {/* Stablecoin Selection */}
                    <div className="grid gap-4 mb-8">
                        <h3 className="text-lg font-semibold">Select Stablecoin</h3>
                        {stablecoins.map((coin) => (
                            <button
                                key={coin.symbol}
                                onClick={() => setSelectedStablecoin(coin.symbol)}
                                className={`p-6 rounded-xl border transition-all ${selectedStablecoin === coin.symbol
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400">Available</div>
                                        <div className="font-bold">{coin.liquidity}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Borrow Amount Input */}
                    <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Borrow Amount</label>
                            <div className="text-sm">
                                <span className="text-gray-400 mr-2">Max:</span>
                                <button
                                    onClick={() => setBorrowAmount(calculateMaxBorrow().toString())}
                                    className="text-primary-400 hover:text-primary-300"
                                >
                                    ${calculateMaxBorrow().toFixed(2)}
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={borrowAmount}
                                onChange={(e) => setBorrowAmount(e.target.value)}
                                className="w-full bg-gray-900 rounded-lg border-gray-700 pr-20"
                                placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="text-gray-400">{selectedStablecoin}</span>
                            </div>
                        </div>

                        {/* Borrow Details */}
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Interest Rate (APR)</span>
                                <span>{CONTRACT_CONSTANTS.INTEREST_RATE}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Collateral Ratio</span>
                                <span>{CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO}%</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Repay Interface
                <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Repay Loan</h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Borrowed</span>
                            <span>${position.borrowedAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Interest Accrued</span>
                            <span className="text-red-400">
                                ${calculateInterest(position.borrowedAmount, position.borrowTimestamp).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total to Repay</span>
                            <span className="font-bold">
                                ${(position.borrowedAmount + calculateInterest(position.borrowedAmount, position.borrowTimestamp)).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <label className="text-sm font-medium mb-2 block">Repay Amount</label>
                        <input
                            type="text"
                            value={borrowAmount}
                            onChange={(e) => setBorrowAmount(e.target.value)}
                            className="w-full bg-gray-900 rounded-lg border-gray-700 pr-20"
                            placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 mt-8">
                            <span className="text-gray-400">{selectedStablecoin}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Button */}
            <button
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all flex items-center justify-center group"
                disabled={!borrowAmount}
            >
                {mode === 'borrow' ? 'Borrow' : 'Repay'} {selectedStablecoin}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Warning Box */}
            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-400">
                    {mode === 'borrow'
                        ? `Maintain a collateral ratio above ${CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO}
                        % to avoid liquidation. If your collateral ratio falls below ${CONTRACT_CONSTANTS.LIQUIDATION_RATIO}%, your position may be liquidated.`
                        : 'Repaying your loan will improve your position\'s health factor and reduce liquidation risk. Any accrued interest must be repaid along with the principal.'}
                </p>
            </div>

            {/* Loan Details */}
            {mode === 'borrow' && borrowAmount && (
                <div className="mt-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Loan Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Current Collateral Value</span>
                            <span>${position.collateralValue}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Borrow Amount</span>
                            <span>${parseFloat(borrowAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Interest Rate (APR)</span>
                            <span>{CONTRACT_CONSTANTS.INTEREST_RATE}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">New Health Factor</span>
                            <span className={getHealthFactorStatus(calculateHealthFactor(parseFloat(borrowAmount))).color}>
                                {calculateHealthFactor(parseFloat(borrowAmount)).toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Position Status</span>
                            <span className={getHealthFactorStatus(calculateHealthFactor(parseFloat(borrowAmount))).color}>
                                {getHealthFactorStatus(calculateHealthFactor(parseFloat(borrowAmount))).status}
                            </span>
                        </div>
                    </div>

                    {/* Health Factor Visualization */}
                    <div className="mt-4">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${calculateHealthFactor(parseFloat(borrowAmount)) >= CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO
                                    ? 'bg-green-500'
                                    : calculateHealthFactor(parseFloat(borrowAmount)) >= CONTRACT_CONSTANTS.LIQUIDATION_RATIO
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                style={{
                                    width: `${Math.min((calculateHealthFactor(parseFloat(borrowAmount)) / CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO) * 100, 100)}%`
                                }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>Liquidation ({CONTRACT_CONSTANTS.LIQUIDATION_RATIO}%)</span>
                            <span>Target ({CONTRACT_CONSTANTS.COLLATERALIZATION_RATIO}%)</span>
                            <span>Safe (>180%)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}