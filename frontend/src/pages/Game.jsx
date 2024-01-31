import React from "react";
import Header from "../components/Header";

const Game = () => {
  return (
    <div>
      <Header />
      <main className="flex flex-col gap-5 mt-10 items-center justify-center">
        <div className="flex gap-48 mt-10">
          <div className="flex flex-col items-center gap-8">
            <h2 className="font-bold text-lg">
              Dealer: <span id="dealer-sum"></span>
            </h2>
            <div className="flex justify-around gap-5" id="dealer-cards">
              <img id="hidden" src="./cards/BACK.png" className="w-32" />
              <img id="hidden" src="./cards/BACK.png" className="w-32" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-8">
            <h2 className="font-bold text-lg">
              You: <span id="your-sum"></span>
            </h2>
            <div className="flex justify-around gap-5" id="your-cards">
              <img id="hidden" src="./cards/BACK.png" className="w-32" />
              <img id="hidden" src="./cards/BACK.png" className="w-32" />
            </div>
          </div>
        </div>
        <br />
        <div className="flex gap-10">
          <button className="p-3 border hover:border-yellow-400" id="hit">
            Hit
          </button>
          <button className="p-3 border hover:border-yellow-400" id="stay">
            Stay
          </button>
        </div>
        <p id="results"></p>
      </main>
    </div>
  );
};

export default Game;
