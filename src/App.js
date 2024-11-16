import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from "ethers";

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Borrow from './pages/Borrow';

const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID; // Make sure to set this in your .env file

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1", // mainnet
            rpcTarget: "https://rpc.ankr.com/eth",
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(new ethers.providers.Web3Provider(web3auth.provider));
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(new ethers.providers.Web3Provider(web3authProvider));
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navbar onLogin={login} onLogout={logout} isLoggedIn={!!provider} />
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard provider={provider} getUserInfo={getUserInfo} />} />
            <Route path="/deposit" element={<Deposit provider={provider} />} />
            <Route path="/borrow" element={<Borrow provider={provider} />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'bg-gray-800 text-white',
            duration: 5000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;