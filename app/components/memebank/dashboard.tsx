import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Wallet, Coins, PiggyBank, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { StatCard } from '../statCard';
import WalletConnect from '../connectWallet';
import { MemebankContract } from '@/utils/contracts';
import type { ContractTransaction } from 'ethers';

interface InputField {
    label: string;
    name: string;
    type: 'deposit' | 'borrow' | 'repay' | 'depositStable';
    buttonColor: string;
    buttonText: string;
    loadingText: string;
}

const inputFields: InputField[] = [
    {
        label: 'Deposit Collateral',
        name: 'depositCollateral',
        type: 'deposit',
        buttonColor: 'bg-blue-500 hover:bg-blue-600',
        buttonText: 'Deposit',
        loadingText: 'Depositing...'
    },
    {
        label: 'Borrow Stablecoins',
        name: 'borrowAmount',
        type: 'borrow',
        buttonColor: 'bg-green-500 hover:bg-green-600',
        buttonText: 'Borrow',
        loadingText: 'Borrowing...'
    },
    {
        label: 'Deposit Stablecoins',
        name: 'depositStable',
        type: 'depositStable',
        buttonColor: 'bg-purple-500 hover:bg-purple-600',
        buttonText: 'Deposit',
        loadingText: 'Depositing...'
    },
    {
        label: 'Repay Loan',
        name: 'repayAmount',
        type: 'repay',
        buttonColor: 'bg-red-500 hover:bg-red-600',
        buttonText: 'Repay',
        loadingText: 'Repaying...'
    }
];

export const MemebankDashboard = () => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { toast } = useToast();

    const [repaymentDetails, setRepaymentDetails] = useState<{
        repaymentAmount: string;
        deadline: number;
        status: string;
    }>({
        repaymentAmount: '0',
        deadline: 0,
        status: 'No active loan'
    });

    const [isLoading, setIsLoading] = useState({
        deposit: false,
        borrow: false,
        repay: false,
        depositStable: false
    });

    const [inputAmounts, setInputAmounts] = useState({
        depositCollateral: '',
        borrowAmount: '',
        repayAmount: '',
        depositStable: ''
    });

    const [userStats, setUserStats] = useState({
        collateral: '0',
        borrowed: '0',
        deposited: '0',
        borrowInterest: '0',
        lendingInterest: '0'
    });

    const [platformStats, setPlatformStats] = useState<{
        totalDeposits: string;
        totalBorrowed: string;
        currentPrice: string;
        isEmergency: boolean;
        collateralRatio: string; // Add this line
    }>({
        totalDeposits: '0',
        totalBorrowed: '0',
        currentPrice: '0',
        isEmergency: false,
        collateralRatio: '0' // Initialize it here
    });

    useEffect(() => {
        const fetchRepaymentDetails = async () => {
            try {
                if (address) {
                    const contract = new MemebankContract();
                    const details = await contract.getFormattedRepaymentAmount(address);
                    setRepaymentDetails(details);
                } else {
                    throw new Error('Address is not defined');
                }
            } catch (error) {
                console.error('Error fetching repayment details:', error);
                toast({
                    title: 'Error fetching repayment details',
                    description: 'Please try again later',
                    variant: 'destructive'
                });
            }
        };

        if (isConnected && chainId === 14) {
            fetchRepaymentDetails();
        }
    }, [isConnected, chainId, address, toast]);

    // const loadData = useCallback(async () => {
    //     if (!isConnected || !address || chainId !== 14) return;

    //     try {
    //         const contract = new MemebankContract();

    //         // Load user data and platform stats
    //         const [userData, platformData] = await Promise.all([
    //             contract.getUserData(address),
    //             contract.getPlatformStats()
    //         ]);

    //         // Update user stats
    //         setUserStats({
    //             collateral: Number(userData.collateralAmount).toFixed(4),
    //             borrowed: Number(userData.borrowedAmount).toFixed(4),
    //             deposited: Number(userData.stableDeposited).toFixed(4),
    //             borrowInterest: Number(userData.borrowInterest).toFixed(4),
    //             lendingInterest: Number(userData.lendingInterest).toFixed(4)
    //         });

    //         // Update platform stats
    //         setPlatformStats({
    //             totalDeposits: Number(platformData.totalDeposits).toFixed(4),
    //             totalBorrowed: Number(platformData.totalBorrowed).toFixed(4),
    //             currentPrice: Number(platformData.currentPrice).toFixed(4),
    //             isEmergency: platformData.isEmergency
    //         });

    //     } catch (error) {
    //         console.error('Error loading data:', error);
    //         toast({
    //             title: 'Error loading data',
    //             description: 'Please try again later',
    //             variant: 'destructive'
    //         });
    //     }
    // }, [address, isConnected, chainId, toast]);

    const loadData = useCallback(async () => {
        if (!isConnected || !address || chainId !== 14) return;

        try {
            const contract = new MemebankContract();

            // Fetch user data, platform stats, and the additional interest rates and ratio
            const [userData, platformData, lendingRate, borrowRate, collateralRatio] = await Promise.all([
                contract.getUserData(address),
                contract.getPlatformStats(),
                contract.getLendingInterestRate(),
                contract.getBorrowInterestRate(),
                contract.getCollateralizationRatio(),
            ]);

            // Update user stats
            setUserStats({
                collateral: Number(userData.collateralAmount).toFixed(4),
                borrowed: Number(userData.borrowedAmount).toFixed(4),
                deposited: Number(userData.stableDeposited).toFixed(4),
                borrowInterest: borrowRate, // Use the fetched borrow rate
                lendingInterest: lendingRate // Use the fetched lending rate
            });

            // Update platform stats
            setPlatformStats({
                totalDeposits: Number(platformData.totalDeposits).toFixed(4),
                totalBorrowed: Number(platformData.totalBorrowed).toFixed(4),
                currentPrice: Number(platformData.currentPrice).toFixed(4),
                isEmergency: platformData.isEmergency,
                collateralRatio // Add the fetched collateral ratio
            });

        } catch (error) {
            console.error('Error loading data:', error);
            toast({
                title: 'Error loading data',
                description: 'Please try again later',
                variant: 'destructive'
            });
        }
    }, [address, isConnected, chainId, toast]);


    const handleTransaction = async (type: InputField['type'], amount: string) => {
        if (!amount || Number.parseFloat(amount) <= 0) {
            toast({
                title: 'Invalid amount',
                description: 'Please enter a valid amount',
                variant: 'destructive'
            });
            return;
        }

        if (!isConnected) {
            toast({
                title: 'Wallet not connected',
                description: 'Please connect your wallet to continue',
                variant: 'destructive'
            });
            return;
        }

        if (chainId !== 14) {
            toast({
                title: 'Wrong network',
                description: 'Please switch to Flare network',
                variant: 'destructive'
            });
            return;
        }

        setIsLoading(prev => ({ ...prev, [type]: true }));

        try {
            const contract = new MemebankContract();
            let tx: ContractTransaction;

            switch (type) {
                case 'deposit':
                    tx = await contract.depositCollateral(amount);
                    break;
                case 'borrow':
                    tx = await contract.borrowStablecoins(amount);
                    break;
                case 'repay':
                    tx = await contract.repayLoan(amount);
                    break;
                case 'depositStable':
                    tx = await contract.depositStable(amount);
                    break;
                default:
                    throw new Error('Invalid transaction type');
            }

            toast({
                title: 'Transaction Submitted',
                description: 'Please wait for confirmation...'
            });

            // Wait for transaction confirmation
            // @ts-ignore
            const receipt = await tx.wait();

            if (receipt?.status === 1) {
                // Clear input
                setInputAmounts(prev => ({
                    ...prev,
                    [type === 'deposit' ? 'depositCollateral' : `${type}Amount`]: ''
                }));

                // Add a small delay to ensure the blockchain state is updated
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Refresh data
                await loadData();

                toast({
                    title: 'Transaction Successful',
                    description: `${type.charAt(0).toUpperCase() + type.slice(1)} completed successfully`
                });

                // Update local state immediately for better UX
                if (type === 'deposit') {
                    setUserStats(prev => ({
                        ...prev,
                        collateral: (Number(prev.collateral) + Number(amount)).toFixed(4)
                    }));
                } else if (type === 'depositStable') {
                    setUserStats(prev => ({
                        ...prev,
                        deposited: (Number(prev.deposited) + Number(amount)).toFixed(4)
                    }));
                }
            } else {
                throw new Error('Transaction failed');
            }
        } catch (error) {
            console.error(`${type} error:`, error);
            toast({
                title: 'Transaction Failed',
                description: error instanceof Error ? error.message : 'Please try again later',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    // Set up automatic refresh
    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, [loadData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === '' || Number.parseFloat(value) >= 0) {
            setInputAmounts(prev => ({ ...prev, [name]: value }));
        }
    };

    const renderInputField = ({ label, name, type, buttonColor, buttonText, loadingText }: InputField) => (
        <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium mb-1">
                {label}
            </label>
            <div className="flex gap-2">
                <input
                    type="number"
                    id={name}
                    name={name}
                    value={inputAmounts[name as keyof typeof inputAmounts]}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Amount"
                    disabled={!isConnected || chainId !== 14 || isLoading[type]}
                    min="0"
                    step="any"
                />
                <Button
                    onClick={() => handleTransaction(type, inputAmounts[name as keyof typeof inputAmounts])}
                    disabled={
                        !isConnected ||
                        chainId !== 14 ||
                        isLoading[type] ||
                        !inputAmounts[name as keyof typeof inputAmounts]
                    }
                    className={`${buttonColor} w-28`}
                >
                    {isLoading[type] ? loadingText : buttonText}
                </Button>
            </div>
        </div>
    );

    const stats = [
        { title: 'Collateral', value: userStats.collateral, subtitle: 'Memecoin', icon: Wallet },
        { title: 'Borrowed', value: userStats.borrowed, subtitle: 'Stablecoin', icon: Coins },
        { title: 'Deposited', value: userStats.deposited, subtitle: 'Stablecoin', icon: PiggyBank },
        { title: 'Price', value: platformStats.currentPrice, subtitle: 'USDC/Memecoin', icon: ArrowDownUp }
    ];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Memebank Dashboard</h1>
                    <p className="text-gray-600">Deposit memecoin collateral and borrow stablecoins</p>
                </div>
                <WalletConnect />
            </div>

            {!isConnected ? (
                <Card className="p-8 text-center">
                    <CardContent className="flex flex-col items-center gap-4">
                        <AlertCircle className="h-12 w-12 text-gray-400" />
                        <h2 className="text-xl font-semibold">Connect Wallet to Continue</h2>
                        <p className="text-gray-600">Please connect your wallet to access Memebank features</p>
                    </CardContent>
                </Card>
            ) : chainId !== 14 ? (
                <Card className="p-8 text-center">
                    <CardContent className="flex flex-col items-center gap-4">
                        <AlertCircle className="h-12 w-12 text-gray-400" />
                        <h2 className="text-xl font-semibold">Wrong Network</h2>
                        <p className="text-gray-600">Please switch to Flare network to continue</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat) => (
                            <StatCard key={stat.title} {...stat} />
                        ))}
                        <Card>
                            <CardHeader>
                                <CardTitle>Rates & Ratios</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>Lending Interest Rate: {userStats.lendingInterest}%</p>
                                <p>Borrow Interest Rate: {userStats.borrowInterest}%</p>
                                <p>Loan to Value: {platformStats.collateralRatio}%</p>
                            </CardContent>
                        </Card>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Deposit & Borrow</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {inputFields.slice(0, 2).map(renderInputField)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Lending & Repayment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {inputFields.slice(2).map(renderInputField)}
                                <div>
                                    <p className="text-sm font-medium mb-1">Repayment Details</p>
                                    <div className="text-gray-600">
                                        <p>Repayment Amount: {repaymentDetails.repaymentAmount} USDC</p>
                                        <p>Deadline: {repaymentDetails.deadline > 0 ? new Date(repaymentDetails.deadline).toLocaleString() : 'Immediately'}</p>
                                        <p>Status: {repaymentDetails.status}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default MemebankDashboard;