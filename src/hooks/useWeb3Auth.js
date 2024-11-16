import { useState, useEffect, useCallback } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";
import { ethers } from "ethers";

const useWeb3Auth = () => {
    const [web3auth, setWeb3auth] = useState(null);
    const [provider, setProvider] = useState(null);
    const [walletServices, setWalletServices] = useState(null);
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const init = useCallback(async () => {
        try {
            const web3auth = new Web3Auth({
                clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
                web3AuthNetwork: "cyan",
                chainConfig: {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: "0x1", // Ethereum mainnet
                    rpcTarget: "https://rpc.ankr.com/eth",
                },
                uiConfig: {
                    theme: "dark",
                    loginMethodsOrder: ["google", "facebook", "twitter"],
                    appLogo: "/logo.png",
                    modalZIndex: "2147483647",
                }
            });

            // Add Wallet Services Plugin
            const walletServicesPlugin = new WalletServicesPlugin({
                wsEmbedOpts: {
                    displayMode: "full",
                }
            });
            web3auth.addPlugin(walletServicesPlugin);
            setWalletServices(walletServicesPlugin);

            // Add Adapters
            const metamaskAdapter = new MetamaskAdapter({
                clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
            });
            web3auth.configureAdapter(metamaskAdapter);

            const coinbaseAdapter = new CoinbaseAdapter({
                clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
            });
            web3auth.configureAdapter(coinbaseAdapter);

            await web3auth.initModal();
            setWeb3auth(web3auth);

            if (web3auth.provider) {
                setProvider(web3auth.provider);
                const user = await web3auth.getUserInfo();
                setUser(user);
                const ethersProvider = new ethers.providers.Web3Provider(web3auth.provider);
                const signer = ethersProvider.getSigner();
                const address = await signer.getAddress();
                setAddress(address);
            }
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        init();
    }, [init]);

    const login = async (loginType = "google") => {
        if (!web3auth) {
            setError("Web3Auth not initialized");
            return;
        }
        try {
            const web3authProvider = await web3auth.connect();
            setProvider(web3authProvider);
            const user = await web3auth.getUserInfo();
            setUser(user);

            const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
            const signer = ethersProvider.getSigner();
            const address = await signer.getAddress();
            setAddress(address);
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    const logout = async () => {
        if (!web3auth) {
            setError("Web3Auth not initialized");
            return;
        }
        try {
            await web3auth.logout();
            setProvider(null);
            setUser(null);
            setAddress(null);
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    // Wallet Services Functions
    const openWalletUI = async () => {
        if (!walletServices) return;
        try {
            await walletServices.showWalletUI();
        } catch (error) {
            console.error(error);
        }
    };

    const openFiatOnRamp = async () => {
        if (!walletServices) return;
        try {
            await walletServices.initiateFiatOnRamp();
        } catch (error) {
            console.error(error);
        }
    };

    // Token Transfer Function
    const transferTokens = async (to, amount, tokenAddress) => {
        if (!provider) return;
        try {
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();

            if (tokenAddress) {
                // ERC20 Transfer
                const tokenContract = new ethers.Contract(
                    tokenAddress,
                    ["function transfer(address to, uint256 amount)"],
                    signer
                );
                const tx = await tokenContract.transfer(to, amount);
                return await tx.wait();
            } else {
                // ETH Transfer
                const tx = await signer.sendTransaction({
                    to,
                    value: ethers.utils.parseEther(amount)
                });
                return await tx.wait();
            }
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    return {
        web3auth,
        provider,
        user,
        address,
        loading,
        error,
        login,
        logout,
        openWalletUI,
        openFiatOnRamp,
        transferTokens
    };
};

export default useWeb3Auth;