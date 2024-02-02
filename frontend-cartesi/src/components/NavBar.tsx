import Container from "./Container";
import { Network } from "../Network";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isGameRoute = location.pathname === "/game";

  return (
    <div className="flex justify-between border-b border-yellow-200 p-5">
      <div className="flex gap-2">
        <img src="../../cards/A-H.png" className="w-4 h-5" alt="" />
        <Link to="/" className="font-bold text-yellow-300">
          Blockjack
        </Link>
      </div>
      <div className="flex gap-20">
        <p className="hover:text-yellow-400 cursor-pointer">About</p>
        <Link
          to="/game"
          className={`hover:text-yellow-400 cursor-pointer ${
            isGameRoute ? "text-yellow-400" : ""
          }`}
        >
          Game
        </Link>
      </div>
      <Network />
    </div>
  );
};

export default Navbar;
