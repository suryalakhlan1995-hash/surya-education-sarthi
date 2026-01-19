import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold hover:text-yellow-300">
          Education Sarathi
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/dashboard" className="hover:text-yellow-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/online-exam" className="hover:text-yellow-300">
                Online Exam
              </Link>
            </li>
            <li>
              <Link to="/school-panel" className="hover:text-yellow-300">
                School Panel
              </Link>
            </li>
            <li>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hover:text-yellow-300"
              >
                User
              </button>
              {menuOpen && (
                <div className="absolute mt-2 bg-white text-black rounded shadow-lg p-2">
                  <Link to="/profile" className="block p-1 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/logout" className="block p-1 hover:bg-gray-100">
                    Logout
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}