"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setAvatarUrl(userDoc.exists() ? userDoc.data().avatar || null : null);
      } else {
        setUser(null);
        setAvatarUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            <div className="relative w-8 h-8">
              <Image
                src="/favicon.ico"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="bg-gradient-to-r bg-purple-600 bg-clip-text text-transparent">
              Karbit-Checker
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === "/dashboard"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              🏠 Home
            </Link>

            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === "/dashboard"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              🎮 Game
            </Link>

            <Link
              href="/feedback"
              className="relative px-4 py-2 rounded-lg font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              💬 Feedback
            </Link>

            {/* LOGIN / PROFILE */}
            {!user ? (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pathname === "/login"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-gradient-to-r bg-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
                }`}
              >
                Masuk
              </Link>
            ) : (
              <div className="relative">
                {/* Avatar Button */}
                <button
                  onClick={toggleDropdown}
                  className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500 hover:ring-purple-400 transition-all duration-200 hover:scale-105"
                >
                  <Image
                    src={avatarUrl || "/favicon.ico"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* THEME TOGGLE */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU CONTENT */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-inner">
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link
              href="/"
              className={`block px-4 py-2 rounded-lg font-medium ${
                pathname === "/dashboard"
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              🏠 Home
            </Link>

            <Link
              href="/dashboard"
              className={`block px-4 py-2 rounded-lg font-medium ${
                pathname === "/dashboard"
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              🎮 Game
            </Link>

            <Link
              href="/feedback"
              className={`block px-4 py-2 rounded-lg font-medium ${
                pathname === "/dashboard"
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              💬 Feedback
            </Link>

            {!user ? (
              <Link
                href="/login"
                className="block px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil Saya
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-gray-800"
                >
                  Keluar
                </button>
              </>
            )}

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Tema
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
