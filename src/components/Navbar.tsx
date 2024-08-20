"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <header className="border px-4 py-6 lg:px-10 lg:py-4">
      <div className="container flex items-center justify-between border">
        <nav className="border">
          <Link
            href="/"
            className="leading-120 border text-lg font-bold text-dark-b1 dark:text-light-b4"
          >
            AI Network LLM Arena
          </Link>
        </nav>
        <div className="max-desktop:hidden">
          <Link href="/leaderboard">
            {/* <a className="px-2">Leaderboard</a> */}
            Leaderboard
          </Link>
          <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
          {isOpen && (
            <div className="bg-white dark:bg-darkGray absolute right-0 mt-2 w-48 rounded-md shadow-lg">
              <Link href="/">
                {/* <a className="block px-4 py-2">Home</a> */}
                Home
              </Link>
              <Link href="/leaderboard">
                {/* <a className="block px-4 py-2">Leaderboard</a> */}
                Leaderboard
              </Link>
              <Link href="/mypage">
                {/* <a className="block px-4 py-2">My Page</a> */}
                My Page
              </Link>
            </div>
          )}
        </div>
        <div>
          <button onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button onClick={() => setIsOpen(!isOpen)}>UserName</button>
      {isOpen && (
        <div className="bg-white dark:bg-darkGray absolute right-0 mt-2 w-48 rounded-md shadow-lg">
          <Link href="/mypage">
            {/* <a className="block px-4 py-2">My Page</a> */}
            My Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
