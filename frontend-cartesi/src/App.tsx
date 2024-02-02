// Copyright 2022 Cartesi Pte. Ltd.

import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import Container from "./components/Container";
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import { GraphQLProvider } from "./GraphQL";
import configFile from "./config.json";
import Navbar from "./components/NavBar";

const config: any = configFile;

const injected: any = injectedModule();
init({
  wallets: [injected],
  chains: Object.entries(config).map(([k, v]: [string, any], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "Cartesi Rollups Test DApp",
    icon: "<svg><svg/>",
    description: "Demo app for Cartesi Rollups",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});

const App: FC = () => {
  return (
    <Container>
      <Router>
        <Navbar />
        <GraphQLProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GraphQLProvider>
      </Router>
    </Container>
  );
};

export default App;
