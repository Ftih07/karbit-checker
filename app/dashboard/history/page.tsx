"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface GameHistory {
  id: string;
  mode: "friend" | "bot";
  winner?: string;
  players?: {
    X: string;
    O: string;
  };
  difficulty?: string;
  result?: string;
  timestamp: {
    seconds: number;
  };
}

export default function GameHistoryPage() {
  const [games, setGames] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        const q = query(
          collection(db, "games"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GameHistory[];
        setGames(data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
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
            <span className="text-2xl">🕹️</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Riwayat Permainan
            </h1>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-center max-w-md">
              <span className="text-6xl mb-4 block">🎮</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Belum Ada Riwayat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Mulai main game untuk melihat riwayat permainan kamu di sini!
              </p>
              <button
                onClick={() => router.push("/dashboard/games/tictactoe")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Main Sekarang
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Total Permainan:{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {games.length}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
                >
                  {/* Game Mode Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                      <span className="text-2xl">
                        {game.mode === "friend" ? "👥" : "🤖"}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {game.mode === "friend"
                        ? "Main Bareng Teman"
                        : "Main Lawan Bot"}
                    </h2>
                  </div>

                  {/* Game Details */}
                  <div className="space-y-3 mb-4">
                    {game.mode === "friend" ? (
                      <>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-lg">🧍‍♂️</span>
                          <span className="font-semibold">
                            {game.players?.X}
                          </span>
                          <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                            X
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-lg">🧍‍♀️</span>
                          <span className="font-semibold">
                            {game.players?.O}
                          </span>
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                            O
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏆</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {game.winner === "draw"
                                ? "Seri 😅"
                                : game.winner === "X"
                                ? game.players?.X
                                : game.players?.O}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Tingkat Kesulitan:
                          </span>
                          <span className="capitalize font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-lg text-sm">
                            {game.difficulty}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏆</span>
                            <span
                              className={`font-semibold ${
                                game.result === "win"
                                  ? "text-green-600 dark:text-green-400"
                                  : game.result === "lose"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {game.result === "win"
                                ? "Kamu Menang 🎉"
                                : game.result === "lose"
                                ? "Kamu Kalah 😢"
                                : "Seri 😅"}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span>🕐</span>
                    <span>
                      {new Date(game.timestamp.seconds * 1000).toLocaleString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Made with 💜 by Ftih07</p>
      </footer>
    </div>
  );
}
