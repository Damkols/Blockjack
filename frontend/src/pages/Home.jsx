import React from "react";
import Header from "../components/Header";

const Home = () => {
  return (
    <div>
      <Header />
      <main className="flex justify-center gap-4 mt-10 flex-col">
        <div className="flex justify-around">
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl text-center font-bold">
              Blockjack Cartesi Game
            </h1>
            <p className="text-center text-xl">
              Welcome to the Blockjack Cartesi Game.
            </p>
            <a
              href="/game"
              className="p-3 border border-yellow-200 hover:border-yellow-400"
            >
              Start Game
            </a>
          </div>
          <img src="../../cards/BACK.png" alt="" className="w-1/4" />
          {/* <img src="../../cards/2-C.png" alt="meme" className="mx-auto" /> */}
        </div>
      </main>
    </div>
  );
};

export default Home;
