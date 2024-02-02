import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between border-b border-yellow-200 p-5">
      <div className="flex gap-2">
        <img src="../../cards/A-H.png" className="w-4 h-5" alt="" />
        <a href="/" className="font-bold text-yellow-300">
          Blockjack
        </a>
      </div>
      <div className="flex gap-20">
        <p className="hover:text-yellow-400 cursor-pointer">About</p>
        <a href="/game" className="hover:text-yellow-400 cursor-pointer">
          Game
        </a>
      </div>
      <div className="font-bold border border-yellow-100 hover:border-yellow-300 hover:text-yellow-200 cursor-pointer px-2 py-1 rounded">
        Connect
      </div>
    </div>
  );
};

export default Header;
