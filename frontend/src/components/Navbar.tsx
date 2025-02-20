
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/10 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-medium text-xl">
              YogEase
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">
                Features
              </Link>
              <Link to="#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">
                How It Works
              </Link>
              <Link to="/yoga" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Try Now
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-xl"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black/10 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-xl text-base font-medium">
              Home
            </Link>
            <Link to="#features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-xl text-base font-medium">
              Features
            </Link>
            <Link to="#how-it-works" className="text-gray-300 hover:text-white block px-3 py-2 rounded-xl text-base font-medium">
              How It Works
            </Link>
            <Link to="/yoga" className="bg-primary hover:bg-primary/90 text-white block px-3 py-2 rounded-xl text-base font-medium">
              Try Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
