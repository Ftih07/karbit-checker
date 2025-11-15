"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // cek user login & ambil data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "user") {
          await signOut(auth);
          router.push("/login");
          return;
        }

        setUserEmail(user.email || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
        await signOut(auth);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Memuat...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Halo! 👋
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Selamat datang kembali,{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {userEmail}
            </span>
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TicTacToe Card */}
          <div className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🎮</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              TicTacToe
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Main game klasik TicTacToe dan asah strategi kamu!
            </p>
            <button
              onClick={() => router.push("/dashboard/games/tictactoe")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Main Sekarang
            </button>
          </div>

          {/* Placeholder Cards for future features */}
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl mb-2 block">✨</span>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Segera Hadir
              </p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🎯</span>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Segera Hadir
              </p>
            </div>
          </div>
        </div>

        {/* Stats or Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💜</span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tentang Game by Karbit-Checker
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                ⚡
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Cepat & Responsif
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                💯
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                100% Gratis
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                🎯
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Mudah Digunakan
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Text */}
      <footer className="mt-10 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <a
              href="/terms"
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 
                 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 
                 dark:hover:bg-gray-800 transition"
            >
              Terms & Services
            </a>
            <a
              href="/privacy"
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700
                 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100
                 dark:hover:bg-gray-800 transition"
            >
              Privacy Policy
            </a>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Made with 💜 by Ftih07
          </p>
        </div>
      </footer>
    </div>
  );
}
