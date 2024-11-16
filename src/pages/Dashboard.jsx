import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const [timeFrame, setTimeFrame] = useState('1W');

    const performanceData = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        tvl: Math.random() * 1000000 + 500000,
        deposits: Math.random() * 500000 + 250000,
        apy: Math.random() * 5 + 5,
    }));

    const userPositions = [
        {
            asset: 'DOGE',
            icon: '🐕',
            collateralAmount: '1,000',
            collateralValue: '$100.00',
            borrowed: '50 USDC',
            borrowedValue: '$50.00',
            cRatio: '200%',
            health: 'Safe'
        },
        {
            asset: 'SHIB',
            icon: '🐕',
            collateralAmount: '10,000,000',
            collateralValue: '$200.00',
            borrowed: '100 USDC',
            borrowedValue: '$100.00',
            cRatio: '180%',
            health: 'Warning'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Time Frame Selector */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex space-x-2">
                    {['24H', '1W', '1M', '3M', 'ALL'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeFrame(tf)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${timeFrame === tf
                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Link
                    to="/deposit"
                    className="p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group"
                >
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400">Deposit</h3>
                    <p className="text-gray-400">Earn up to 12.5% APY on your deposits</p>
                </Link>
                <Link
                    to="/borrow"
                    className="p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-primary-500 transition-all group"
                >
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400">Borrow</h3>
                    <p className="text-gray-400">Use your memecoins as collateral</p>
                </Link>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Total Value Locked</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <XAxis dataKey="day" stroke="#6B7280" />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        padding: '1rem'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="tvl"
                                    stroke="url(#gradient)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#2DD4BF" />
                                        <stop offset="100%" stopColor="#D946EF" />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">APY Trends</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <XAxis dataKey="day" stroke="#6B7280" />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        padding: '1rem'
                                    }}
                                />
                                <Bar dataKey="apy" fill="url(#gradientBar)" />
                                <defs>
                                    <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2DD4BF" />
                                        <stop offset="100%" stopColor="#0D9488" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Your Positions */}
            <div className="rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">Your Positions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Asset</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Collateral</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Borrowed</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">C-Ratio</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Health</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {userPositions.map((position, index) => (
                                <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center mr-3">
                                                {position.icon}
                                            </div>
                                            <span>{position.asset}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div>{position.collateralAmount}</div>
                                            <div className="text-sm text-gray-400">{position.collateralValue}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div>{position.borrowed}</div>
                                            <div className="text-sm text-gray-400">{position.borrowedValue}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{position.cRatio}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${position.health === 'Safe'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {position.health}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}