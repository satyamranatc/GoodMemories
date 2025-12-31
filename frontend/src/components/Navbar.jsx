import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full py-6 px-4 flex justify-between items-center max-w-4xl mx-auto">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-rose-400 transition-colors duration-300">
          <Heart size={16} fill="currentColor" />
        </div>
        <span className="font-serif font-bold text-xl tracking-tight text-gray-800">
          PureThanks
        </span>
      </Link>
    </nav>
  );
};

export default Navbar;
