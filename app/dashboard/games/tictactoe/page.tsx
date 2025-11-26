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
          <div className="inline-block bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 mb-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
            <span className="text-8xl block mb-2 filter drop-shadow-md">
              🎮
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            TicTacToe
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Pilih mode permainan yang kamu suka!
          </p>
        </div>

        {/* Game Mode Cards */}
        {/* Kita ubah Grid layout biar Multiplayer bisa lebih menonjol (full width di mobile, span 2 di desktop kalo mau) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
          {/* --- CARD 1: MULTIPLAYER (HIGHLIGHTED) --- */}
          {/* Ini dibuat beda style-nya: Gradient Background & Text White */}
          <button
            onClick={() =>
              router.push("/dashboard/games/tictactoe/multiplayer")
            }
            className="md:col-span-2 group relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-8 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] text-left border border-white/10"
          >
            {/* Decorative Background Blob */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner group-hover:rotate-6 transition-transform duration-300">
                <span className="text-4xl">🌍</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-bold">Online Multiplayer</h3>
                  <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                    LIVE
                  </span>
                </div>
                <p className="text-indigo-100 text-lg">
                  Buat Room & tantang temanmu jarak jauh secara Realtime!
                </p>
              </div>
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-indigo-600 transition-all duration-300">
                <span className="text-2xl transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </button>

          {/* --- CARD 2: FRIEND LOCAL --- */}
          <button
            onClick={() => router.push("/dashboard/games/tictactoe/friend")}
            className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-cyan-400 dark:hover:border-cyan-500 hover:scale-[1.02] text-left"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Main Bareng Teman
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Satu HP berdua. Mode klasik offline.
            </p>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
              <span>Main Lokal</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </div>
          </button>

          {/* --- CARD 3: VS BOT --- */}
          <button
            onClick={() => router.push("/dashboard/games/tictactoe/bot")}
            className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-[1.02] text-left"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Lawan AI Bot
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Latihan strategi melawan komputer.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <span>Latihan</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </div>
          </button>
        </div>

        {/* History Button (Small & Minimalist) */}
        <button
          onClick={() => router.push("/dashboard/history")}
          className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-md transition-all duration-300"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            📜
          </span>
          <span className="font-medium">Lihat Riwayat Permainan</span>
        </button>

        {/* Info Cards (Footer) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-16 opacity-70 hover:opacity-100 transition-opacity">
          {/* ... Info Cards tetap sama seperti sebelumnya ... */}
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-xl mb-1">⚡</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Realtime Chat
            </p>
          </div>
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-xl mb-1">🏆</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Sistem Poin
            </p>
          </div>
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-xl mb-1">🔄</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Fitur Rematch
            </p>
          </div>
        </div>
      </main>

      {/* Footer Text */}
      <footer className="mt-10 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center gap-4">
          {/* ... Footer content sama ... */}
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Made with 💜 by Ftih07
          </p>
        </div>
      </footer>
    </div>
  );
}
