import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, TrendingUp, Globe } from 'lucide-react';

export default function Landing() {
    const [animatedStats, setAnimatedStats] = useState({
        tvl: 0,
        users: 0,
        apy: 0,
        volume: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedStats(prev => ({
                tvl: Math.min(prev.tvl + 100000, 1500000),
                users: Math.min(prev.users + 15, 1500),
                apy: Math.min(prev.apy + 0.2, 12.5),
                volume: Math.min(prev.volume + 200000, 5000000)
            }));
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const memecoins = [
        { name: 'DOGE', icon: '🐕', price: '$0.081', change: '+5.2%', marketCap: '$10.5B', volume: '$1.2B' },
        { name: 'SHIB', icon: '🐕', price: '$0.00001', change: '+3.1%', marketCap: '$5.2B', volume: '$500M' },
        { name: 'PEPE', icon: '🐸', price: '$0.000001', change: '+7.8%', marketCap: '$800M', volume: '$150M' },
        { name: 'FLOKI', icon: '🐕', price: '$0.00002', change: '+4.5%', marketCap: '$400M', volume: '$80M' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-radial from-primary-500/20 via-gray-900 to-gray-900">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative">
                    <div className="text-center mb-16">
                        <h1 className="text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 text-transparent bg-clip-text">
                                Unlock the True Value
                            </span>
                            <br />
                            of Your Memecoins
                        </h1>

                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                            The first decentralized lending protocol designed specifically for memecoins.
                            Deposit, borrow, and earn - all in one secure platform.
                        </p>

                        <div className="flex justify-center gap-6 mb-20">
                            <Link
                                to="/dashboard"
                                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all flex items-center group"
                            >
                                Launch App
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#learn"
                                className="px-8 py-4 bg-gray-800/50 backdrop-blur rounded-lg font-semibold text-lg hover:bg-gray-700/50 transition-all border border-gray-700"
                            >
                                How It Works
                            </a>
                        </div>

                        {/* Live Stats */}
                        <div className="grid grid-cols-4 gap-8 max-w-5xl mx-auto">
                            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                                <div className="text-3xl font-bold mb-2 group-hover:text-primary-400">
                                    ${(animatedStats.tvl).toLocaleString()}
                                </div>
                                <div className="text-gray-400">Total Value Locked</div>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                                <div className="text-3xl font-bold mb-2 group-hover:text-primary-400">
                                    {animatedStats.users.toLocaleString()}+
                                </div>
                                <div className="text-gray-400">Active Users</div>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                                <div className="text-3xl font-bold mb-2 group-hover:text-primary-400">
                                    {animatedStats.apy.toFixed(1)}%
                                </div>
                                <div className="text-gray-400">Maximum APY</div>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                                <div className="text-3xl font-bold mb-2 group-hover:text-primary-400">
                                    ${(animatedStats.volume).toLocaleString()}
                                </div>
                                <div className="text-gray-400">24h Volume</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Memecoins */}
            <div className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Supported Memecoins</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Leverage your favorite memecoins with our industry-leading collateralization ratios
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {memecoins.map((coin, index) => (
                            <div key={index} className="p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center text-2xl">
                                        {coin.icon}
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold group-hover:text-primary-400">{coin.name}</div>
                                        <div className="text-green-400">{coin.change}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Price</span>
                                        <span>{coin.price}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Market Cap</span>
                                        <span>{coin.marketCap}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Volume</span>
                                        <span>{coin.volume}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Three simple steps to start earning with your memecoins
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-6 text-2xl">
                                1️⃣
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary-400">Connect Wallet</h3>
                            <p className="text-gray-400">
                                Connect your wallet containing memecoins you want to use as collateral
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-6 text-2xl">
                                2️⃣
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary-400">Deposit Memecoins</h3>
                            <p className="text-gray-400">
                                Deposit your memecoins as collateral to unlock borrowing power
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-6 text-2xl">
                                3️⃣
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary-400">Start Earning</h3>
                            <p className="text-gray-400">
                                Borrow stablecoins or earn interest by providing liquidity
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20" />
                        <div className="absolute inset-0 backdrop-blur-sm" />
                        <div className="relative p-12 text-center">
                            <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
                            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join thousands of users who are already earning with their memecoins.
                                Start your journey with MemeBank today.
                            </p>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all group"
                            >
                                Launch App
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}