import { useToast } from "@/hooks/use-toast";

export const useTokenError = () => {
    const { toast } = useToast();

    const handleTokenError = (error: unknown) => {
        let title = 'Transaction Failed';
        let description = 'Please try again later';

        if (typeof error === 'object' && error !== null) {
            // Check for specific error types
            if (error instanceof Error) {
                if (error.message.includes('insufficient balance')) {
                    title = 'Insufficient Balance';
                    description = 'You don\'t have enough tokens for this transaction';
                } else if (error.message.includes('allowance')) {
                    title = 'Approval Required';
                    description = 'Please approve token spending first';
                } else if (error.message.includes('user rejected')) {
                    title = 'Transaction Cancelled';
                    description = 'You rejected the transaction';
                }
            }
        }

        toast({
            title,
            description,
            variant: 'destructive'
        });
    };

    return handleTokenError;
};