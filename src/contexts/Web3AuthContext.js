import React, { createContext, useState, useEffect, useContext } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from "ethers";

const Web3AuthContext = createContext(null);

export const Web3AuthProvider = ({ children }) => {
    const [web3auth, setWeb3auth] = useState(null);
    const [provider, setProvider] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const web3auth = new Web3Auth({
                    clientId: "BIFWrSETfvvwMwQDpWPwWLENwoAHRg9VubkNRgQ_FY_E5eR5_3g5iSchbxmhnQbZCHu3ai9nd52OE7LnvtkG--M",
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: "0x1", // mainnet
                        rpcTarget: "https://rpc.ankr.com/eth",
                    },
                });

                setWeb3auth(web3auth);

                await web3auth.initModal();
                if (web3auth.provider) {
                    const web3authProvider = new ethers.providers.Web3Provider(web3auth.provider);
                    setProvider(web3authProvider);
                    const userInfo = await web3auth.getUserInfo();
                    setUser(userInfo);
                }
            } catch (error) {
                console.error("Error initializing Web3Auth", error);
            }
        };

        init();
    }, []);

    const login = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        try {
            const web3authProvider = await web3auth.connect();
            setProvider(new ethers.providers.Web3Provider(web3authProvider));
            const userInfo = await web3auth.getUserInfo();
            setUser(userInfo);
        } catch (error) {
            console.error("Error logging in with Web3Auth", error);
        }
    };

    const logout = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        try {
            await web3auth.logout();
            setProvider(null);
            setUser(null);
        } catch (error) {
            console.error("Error logging out from Web3Auth", error);
        }
    };

    const value = {
        web3auth,
        provider,
        user,
        login,
        logout
    };

    return <Web3AuthContext.Provider value={value}>{children}</Web3AuthContext.Provider>;
};

export const useWeb3Auth = () => {
    return useContext(Web3AuthContext);
};