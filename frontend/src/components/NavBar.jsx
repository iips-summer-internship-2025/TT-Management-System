import { FaCalendarAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/iips.png";

export default function NavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = (event) => {
    event.preventDefault();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-sm">
              {/* <FaCalendarAlt className="text-white text-lg sm:text-xl" /> */}
                  <img 
                    src={logo}
                    alt="IIPS-LOGO"
                    className="h-12 w-12 text-white max-[640px]:w-10 max-[640px]:h-10"
                  />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 leading-tight">
                TimeTable Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                Knowledge Time
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-2 border border-slate-200">
              <div className="bg-gradient-to-r from-slate-400 to-slate-600 p-2 rounded-full">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">System Administrator</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={logoutHandler}
              className="bg-gradient-to-r from-rose-500 to-red-600 text-white px-4 py-2.5 rounded-lg hover:from-rose-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            {menuOpen ? (
              <IoClose className="text-slate-700 text-xl" />
            ) : (
              <GiHamburgerMenu className="text-slate-700 text-xl" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full right-0 bg-white border-b text-xs border-slate-200 shadow-lg rounded-b-2xl ">
          <div className="px-2 py-2 space-y-2 ">
            
            <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="bg-gradient-to-r from-slate-400 to-slate-600 p-2.5 rounded-full">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Admin User</p>
                <p className="text-sm text-slate-500">System Administrator</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logoutHandler}
              className="w-full bg-gradient-to-r from-rose-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-rose-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm font-medium"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
      
    </header>
  );
}