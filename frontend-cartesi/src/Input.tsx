import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";

interface IInputPropos {
  dappAddress: string;
}

export const Input: React.FC<IInputPropos> = (propos) => {
  const rollups = useRollups(propos.dappAddress);
  const [connectedWallet] = useWallets();
  const [input, setInput] = useState<string>("");
  const [hexInput, setHexInput] = useState<boolean>(false);

  //states, logic and functions here

  const sendAddress = async (str: string) => {
    if (rollups) {
      try {
        await rollups.relayContract.relayDAppAddress(propos.dappAddress);
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const addInput = async (str: string) => {
    if (rollups) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        if (hexInput) {
          payload = ethers.utils.arrayify(str);
        }
        await rollups.inputContract.addInput(propos.dappAddress, payload);
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  return (
    <div>
      <div>
        Send Input <br />
        Input:{" "}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="checkbox"
          checked={hexInput}
          onChange={(e) => setHexInput(!hexInput)}
        />
        <span>Raw Hex </span>
        <button onClick={() => addInput(input)} disabled={!rollups}>
          Send
        </button>
        <br />
        <br />
      </div>
    </div>
  );
};
