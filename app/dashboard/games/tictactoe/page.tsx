"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { User } from "firebase/auth";

export default function TicTacToeMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

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
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <span>←</span>
            <span className="font-medium">Kembali</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TicTacToe
            </h1>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-12 min-h-[calc(100vh-180px)]">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <span className="text-8xl block mb-2">🎮</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            TicTacToe
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Pilih mode permainan yang kamu suka!
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
          {/* Play with Friend */}
          <button
            onClick={() => router.push("/dashboard/games/tictactoe/friend")}
            className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 text-left"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Main Bareng Teman
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tantang teman kamu untuk bermain TicTacToe berdua!
            </p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
              <span>Mulai Main</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </div>
          </button>

          {/* Play with Bot */}
          <button
            onClick={() => router.push("/dashboard/games/tictactoe/bot")}
            className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 text-left"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Main Lawan Bot
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Uji kemampuan kamu melawan AI dengan berbagai tingkat kesulitan!
            </p>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
              <span>Mulai Main</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </div>
          </button>
        </div>

        {/* History Button */}
        <button
          onClick={() => router.push("/dashboard/history")}
          className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 flex items-center gap-3"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <span className="text-2xl">🕹️</span>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Lihat Riwayat Permainan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cek semua game yang pernah kamu mainkan
            </p>
          </div>
          <span className="ml-auto text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-12">
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Cepat & Mudah
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Seru Dimainkan
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">💯</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              100% Gratis
            </p>
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
