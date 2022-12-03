import React, { Suspense, useState, lazy, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProviderContext } from "./Web3Provider";
import Layout from "./components/Layout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const CreatePortfolioPage = lazy(() => import("./pages/CreatePortfolioPage"));

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const { provider } = useContext(ProviderContext);

  useEffect(() => {
    const handleProvider = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setIsLoggedIn(true);
        if (!signer) {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    handleProvider();
  }, [provider]);

  return (
    <div style={{}}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  }
                />
                <Route
                  path="/discover"
                  element={
                    <Layout>
                      <DiscoverPage />
                    </Layout>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <Layout>
                      <CreatePortfolioPage />
                    </Layout>
                  }
                />
                <Route
                  path="/portfolio/:portfolioId"
                  element={
                    <Layout>
                      <PortfolioPage />
                    </Layout>
                  }
                />
              </>
            ) : (
              <Route path="*" element={<LoginPage />} />
            )}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default Router;
