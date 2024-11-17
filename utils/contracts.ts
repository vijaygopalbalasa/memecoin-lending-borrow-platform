// utils/contracts.ts
import { ethers } from 'ethers';
import type { ContractTransaction } from 'ethers';
import MemebankABI from "./memebank.json";
import ERC20ABI from "./token.json";  // Your provided ABI

// Contract addresses
const MEMEBANK_ADDRESS = "0x45e10d984820a89Bdb09FA6de5D7C21dd4b8f896";
const MEMECOIN_ADDRESS = "0xdDE2D5D7B99aa5937327f5D9A47539274d244190";
const STABLECOIN_ADDRESS = "0xa1bC998ad3cfBE7915634947165Fa0ADe469b053";  // Add your stablecoin address

interface ERC20Functions {
    approve(spender: string, value: bigint): Promise<ContractTransaction>;
    balanceOf(account: string): Promise<bigint>;
    allowance(owner: string, spender: string): Promise<bigint>;
    decimals(): Promise<number>;
}

interface UserData {
    collateralAmount: string;
    borrowedAmount: string;
    stableDeposited: string;
    borrowInterest: string;
    lendingInterest: string;
}

interface PlatformStats {
    totalDeposits: string;
    totalBorrowed: string;
    currentPrice: string;
    isEmergency: boolean;
}

declare global {
    interface Window {
        ethereum: {
            isMetaMask?: boolean;
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
            // Add other methods as needed
        };
    }
}

export class MemebankContract {
    private contract: ethers.Contract | null = null;
    private memecoin: (ethers.Contract & ERC20Functions) | null = null;
    private stablecoin: (ethers.Contract & ERC20Functions) | null = null;
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.JsonRpcSigner | null = null;

    constructor() {
        if (!window.ethereum) {
            throw new Error("No crypto wallet found. Please install MetaMask.");
        }
        this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    private async initialize() {
        if (!this.signer || !this.contract || !this.memecoin || !this.stablecoin) {
            this.signer = (await this.provider?.getSigner()) || null;
            
            this.contract = new ethers.Contract(
                MEMEBANK_ADDRESS,
                MemebankABI,
                this.signer
            );
            
            this.memecoin = new ethers.Contract(
                MEMECOIN_ADDRESS,
                ERC20ABI,
                this.signer
            ) as (ethers.Contract & ERC20Functions);

            this.stablecoin = new ethers.Contract(
                STABLECOIN_ADDRESS,
                ERC20ABI,
                this.signer
            ) as (ethers.Contract & ERC20Functions);
        }
    }

    private async checkAndApproveToken(
        token: ethers.Contract & ERC20Functions,
        amount: bigint,
        spender: string
    ) {
        if (!this.signer) {
            throw new Error("Signer is not initialized.");
        }
        const signerAddress = await this.signer.getAddress();
        const allowance = await token.allowance(signerAddress, spender);
        
        if (allowance < amount) {
            const tx = await token.approve(spender, amount) as ethers.TransactionResponse;
            await tx.wait();
        }
    }

    async getUserData(address: string): Promise<UserData> {
        await this.initialize();
        try {
            if (!this.contract) {
                throw new Error("Contract is not initialized.");
            }
            const userData = await this.contract.users(address);
            return {
                collateralAmount: ethers.formatEther(userData[0] || 0),
                borrowedAmount: ethers.formatEther(userData[1] || 0),
                stableDeposited: ethers.formatEther(userData[3] || 0),
                borrowInterest: '0',
                lendingInterest: '0'
            };
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }

    async getPlatformStats(): Promise<PlatformStats> {
        await this.initialize();
        try {
            if (!this.contract) {
                throw new Error("Contract is not initialized.");
            }
            const [totalDeposits, currentPrice, isEmergency] = await Promise.all([
                this.contract.totalStableDeposits(),
                this.contract.getMemecoinPrice(),
                this.contract.isEmergencyPricing()
            ]);

            return {
                totalDeposits: ethers.formatEther(totalDeposits || 0),
                totalBorrowed: '0',
                currentPrice: ethers.formatEther(currentPrice || 0),
                isEmergency: Boolean(isEmergency)
            };
        } catch (error) {
            console.error("Error fetching platform stats:", error);
            throw error;
        }
    }

    async depositCollateral(amount: string): Promise<ContractTransaction> {
        await this.initialize();
        const amountWei = ethers.parseEther(amount);

        // First approve memecoin
        if (!this.memecoin) {
            throw new Error("Memecoin contract is not initialized.");
        }
        await this.checkAndApproveToken(
            this.memecoin,
            amountWei,
            MEMEBANK_ADDRESS
        );

        // Ensure contract is initialized before depositing
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
        // Then deposit
        return await this.contract.depositCollateral(amountWei);
    }

    async depositStable(amount: string): Promise<ContractTransaction> {
        await this.initialize();
        const amountWei = ethers.parseEther(amount);

        // Check stablecoin balance
        if (!this.signer || !this.stablecoin) {
            throw new Error("Signer or stablecoin contract is not initialized.");
        }
        const signerAddress = await this.signer.getAddress();
        const balance = await this.stablecoin.balanceOf(signerAddress);
        if (balance < amountWei) {
            throw new Error("Insufficient stablecoin balance");
        }

        // Approve stablecoin
        if (!this.stablecoin) {
            throw new Error("Stablecoin contract is not initialized.");
        }
        await this.checkAndApproveToken(
            this.stablecoin,
            amountWei,
            MEMEBANK_ADDRESS
        );

        // Then deposit
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
        return await this.contract.depositStable(amountWei);
    }

    async borrowStablecoins(amount: string): Promise<ContractTransaction> {
        await this.initialize();
        const amountWei = ethers.parseEther(amount);

        // Check if contract is initialized
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }

        return await this.contract.borrowStablecoins(amountWei);
    }

    async repayLoan(amount: string): Promise<ContractTransaction> {
        await this.initialize();
        const amountWei = ethers.parseEther(amount);

        // Approve stablecoin for repayment
        if (!this.stablecoin) {
            throw new Error("Stablecoin contract is not initialized.");
        }
        await this.checkAndApproveToken(
            this.stablecoin,
            amountWei,
            MEMEBANK_ADDRESS
        );
        // Check if contract is initialized
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
        // Then repay
        return await this.contract.repayLoan(amountWei);
    }

    async getFormattedRepaymentAmount(address: string): Promise<{
        repaymentAmount: string;
        deadline: number;
        status: string;
    }> {
        await this.initialize();
    
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
    
        try {
            // Fetch the formatted repayment details from the contract
            const [repaymentAmount, deadline, status] = await this.contract.getFormattedRepaymentAmount(address);
    
            // Format the repayment amount from wei to ether
            const formattedRepaymentAmount = ethers.formatEther(repaymentAmount);
    
            return {
                repaymentAmount: formattedRepaymentAmount,
                deadline: Number(deadline), // Convert BigNumber to number for easier use
                status,
            };
        } catch (error) {
            console.error("Error fetching repayment amount:", error);
            throw error;
        }
    }
    
    
    async getCollateralValue(address: string): Promise<ethers.BigNumberish> {
        await this.initialize();
    
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
    
        return await this.contract.getCollateralValue(address);
    }

    async getTokenBalance(tokenType: 'memecoin' | 'stablecoin', address: string): Promise<string> {
        await this.initialize();
        const token = tokenType === 'memecoin' ? this.memecoin : this.stablecoin;

        // Check if token is initialized
        if (!token) {
            throw new Error(`${tokenType} contract is not initialized.`);
        }

        const balance = await token.balanceOf(address);
        return ethers.formatEther(balance);
    }

    async getTokenAllowance(tokenType: 'memecoin' | 'stablecoin', owner: string): Promise<string> {
        await this.initialize();
        const token = tokenType === 'memecoin' ? this.memecoin : this.stablecoin;
        // Check if token is initialized
        if (!token) {
            throw new Error(`${tokenType} contract is not initialized.`);
        }
        const allowance = await token.allowance(owner, MEMEBANK_ADDRESS);
        return ethers.formatEther(allowance);
    }

    async getLendingInterestRate(): Promise<string> {
        await this.initialize();
    
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
    
        try {
            const rate = await this.contract.lendingInterestRate();
            return ethers.formatUnits(rate, 2); // Assuming the rate is in basis points (bps)
        } catch (error) {
            console.error("Error fetching lending interest rate:", error);
            throw error;
        }
    }
    
    async getBorrowInterestRate(): Promise<string> {
        await this.initialize();
    
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
    
        try {
            const rate = await this.contract.borrowInterestRate();
            return ethers.formatUnits(rate, 2); // Assuming the rate is in basis points (bps)
        } catch (error) {
            console.error("Error fetching borrow interest rate:", error);
            throw error;
        }
    }
    
    async getCollateralizationRatio(): Promise<string> {
        await this.initialize();
    
        if (!this.contract) {
            throw new Error("Contract is not initialized.");
        }
    
        try {
            const ratio = await this.contract.collateralizationRatio();
            return ethers.formatUnits(ratio, 2); // Assuming the ratio is in percentage format
        } catch (error) {
            console.error("Error fetching collateralization ratio:", error);
            throw error;
        }
    }
    
}