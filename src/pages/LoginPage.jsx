import React, { useContext } from "react";
import { ethers } from "ethers";

import { ProviderContext } from "../Web3Provider";

const networks = {
  mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};

const LoginPage = () => {
  const { setProvider } = useContext(ProviderContext);
  const changeNetwork = async (networkName) => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[networkName],
          },
        ],
      });
    } catch (err) {
      // setError(err.message);
      console.log("error");
    }
  };

  const handleMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await changeNetwork("mumbai");
    setProvider(provider);
  };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-login-background1"
      style={{ display: "grid", gridTemplateColumns: "1fr 480px" }}
    >
      <div className="flex justify-center items-center">
        <img
          src="/assets/login.png"
          alt="login"
          style={{
            height: "416px",
            width: "416px",
          }}
        />
      </div>
      <div
        className="bg-login-foreground1 text-[56px] text-white flex flex-col justify-center items-center"
        style={{ boxShadow: "0px 0px 1px 0px #000" }}
      >
        <div className="flex justify-center items-center ">
          <img
            src="/assets/crolio.svg"
            alt="logo"
            style={{ width: "44px", height: "44px" }}
          />
          <div className="text-[40px] font-medium">Crolio</div>
        </div>
        <p className="text-[32px] font-medium mb-10">Invest in Ideas</p>
        <div className="bg-login-background1 w-[360px] text-[24px] rounded-3xl p-4 shadow-xl border border-login-background">
          <h1 className="text-slate-200 divide-slate-500 border-b border-slate-500">
            Connect Wallet
          </h1>
          <button
            onClick={handleMetamask}
            className="py-4 hover:bg-login-foreground1 w-full rounded-3xl flex justify-center items-center"
          >
            <img
              src="/assets/metamask.svg"
              className="h-8 mr-2"
              alt="metamask logo"
            />
            Metamask
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
