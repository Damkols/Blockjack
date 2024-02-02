import React from "react";
import { FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
  return (
    <div>
      <main className="flex justify-center gap-4 mt-10 flex-col">
        <div className="flex justify-around">
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl text-center font-bold">
              Blockjack Cartesi Game
            </h1>
            <p className="text-center text-xl">
              Welcome to the Blockjack Cartesi Game.
            </p>
            <Link
              to="/game"
              className="p-3 border border-yellow-200 hover:border-yellow-400"
            >
              Start Game
            </Link>
          </div>
          <img src="../../cards/BACK.png" alt="" className="w-1/4" />
        </div>
      </main>
    </div>
  );
};

export default Home;
