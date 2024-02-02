// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { FC } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";

const config: any = configFile;

export const Network: FC = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

  return (
    <div className="font-bold border border-yellow-100 hover:border-yellow-300 hover:text-yellow-200 cursor-pointer px-2 py-1 rounded">
      {!wallet && (
        <button onClick={() => connect()}>
          {connecting ? "Connecting" : "Connect"}
        </button>
      )}
      {wallet && (
        <div>
          <label>Switch Chain</label>
          {settingChain ? (
            <span>Switching chain...</span>
          ) : (
            <select
              className="text-blue-400 font-thin mx-3 rounded-sm outline-none w-[150px]"
              onChange={({ target: { value } }) => {
                if (config[value] !== undefined) {
                  setChain({ chainId: value });
                } else {
                  alert("No deploy on this chain");
                }
              }}
              value={connectedChain?.id}
            >
              {chains.map(({ id, label }) => {
                return (
                  <option key={id} value={id}>
                    {label}
                  </option>
                );
              })}
            </select>
          )}
          <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
        </div>
      )}
    </div>
  );
};
