"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  or,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

// Interface kita update dikit biar bisa nampung data Online juga
interface GameHistory {
  id: string;
  mode: "friend" | "bot" | "online"; // Tambah 'online'
  // Data Lama (Bot/Friend)
  winner?: string;

  // Update Tipe Data Players (NO MORE ANY!)
  players: {
    X: string;
    O: string;
  };

  difficulty?: string;
  result?: string;
  timestamp?: { seconds: number };

  // Data Baru (Khusus Online)
  scores?: { X: number; O: number };
  myResult?: "win" | "lose" | "draw";
  dateObj: Date; // Helper buat sorting
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
        const gamesRef = collection(db, "games");

        // 1. QUERY: Kita update biar bisa ambil data Online & Offline sekaligus
        const q = query(
          gamesRef,
          or(
            where("userId", "==", user.uid), // Logic Lama (Bot/Friend)
            where("players.X.uid", "==", user.uid), // Logic Baru (Online sebagai X)
            where("players.O.uid", "==", user.uid) // Logic Baru (Online sebagai O)
          )
        );

        const snapshot = await getDocs(q);

        const normalizedData: GameHistory[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Deteksi apakah ini game Online Multiplayer?
          // (Ciri: punya roomId atau players.X adalah object)
          const isOnline =
            typeof data.players?.X === "object" && data.players?.X?.uid;

          // Standardisasi Waktu (biar bisa di-sort bareng)
          const timeData = data.timestamp || data.createdAt;
          const dateObj = timeData
            ? new Date(timeData.seconds * 1000)
            : new Date();

          // --- LOGIC CABANG ---

          if (isOnline) {
            // === KHUSUS ONLINE MULTIPLAYER ===
            const pX = data.players.X;
            const pO = data.players.O;
            const scoreX = pX.score || 0;
            const scoreO = pO.score || 0;

            // Tentukan role user
            const myRole = pX.uid === user.uid ? "X" : "O";

            // Tentukan menang/kalah berdasarkan SKOR TOTAL (Bukan winner ronde)
            let myResult: "win" | "lose" | "draw" = "draw";
            if (scoreX > scoreO) myResult = myRole === "X" ? "win" : "lose";
            else if (scoreO > scoreX)
              myResult = myRole === "O" ? "win" : "lose";

            return {
              id: doc.id,
              mode: "online",
              players: { X: pX.name, O: pO.name }, // Ambil nama dari object
              scores: { X: scoreX, O: scoreO },
              myResult,
              dateObj,
              timestamp: timeData,
            };
          } else {
            // === KHUSUS BOT & FRIEND (Logic Asli Kamu) ===
            // Kita kembalikan data mentah-mentah sesuai struktur lama
            return {
              id: doc.id,
              mode: data.mode || "friend", // fallback friend
              winner: data.winner,

              players: data.players as { X: string; O: string },

              difficulty: data.difficulty,
              result: data.result,
              timestamp: data.timestamp,
              dateObj,
            };
          }
        });

        // Sort Manual by Date (karena field di DB beda nama: timestamp vs createdAt)
        normalizedData.sort(
          (a, b) => b.dateObj.getTime() - a.dateObj.getTime()
        );

        setGames(normalizedData);
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
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard/games/tictactoe")}
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
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            {/* ... (UI Kosong tetep sama) ... */}
            <div className="text-center text-gray-500">
              Belum ada riwayat main.
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
                  {/* --- LOGIC DISPLAY: CABANG ONLINE VS OFFLINE --- */}

                  {game.mode === "online" ? (
                    // === TAMPILAN KHUSUS ONLINE (Skor & UI Baru) ===
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl text-2xl">
                          🌐
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Online Multiplayer
                          </h2>
                          <p className="text-xs text-gray-500">
                            {game.dateObj.toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Scoreboard Card */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4 flex justify-between items-center relative">
                        {/* Player X */}
                        <div className="flex flex-col items-center w-[30%] text-center">
                          <span className="text-xs font-bold bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mb-1">
                            X
                          </span>
                          <span className="text-xs font-medium truncate w-full text-gray-700 dark:text-gray-200">
                            {game.players.X}
                          </span>
                        </div>

                        {/* SCORE */}
                        <div className="font-black text-xl text-gray-800 dark:text-white z-10 bg-white dark:bg-gray-800 px-3 py-1 rounded shadow-sm border border-gray-200 dark:border-gray-600">
                          {game.scores?.X} - {game.scores?.O}
                        </div>

                        {/* Player O */}
                        <div className="flex flex-col items-center w-[30%] text-center">
                          <span className="text-xs font-bold bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mb-1">
                            O
                          </span>
                          <span className="text-xs font-medium truncate w-full text-gray-700 dark:text-gray-200">
                            {game.players.O}
                          </span>
                        </div>
                      </div>

                      {/* Result Text */}
                      <div className="text-center pt-2">
                        <span
                          className={`font-bold uppercase text-sm ${
                            game.myResult === "win"
                              ? "text-green-600"
                              : game.myResult === "lose"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {game.myResult === "win"
                            ? "🏆 Kamu Menang!"
                            : game.myResult === "lose"
                            ? "💀 Kamu Kalah"
                            : "🤝 Seri"}
                        </span>
                      </div>
                    </>
                  ) : (
                    // === TAMPILAN LAMA (COPY PASTE KODE ASLIMU) ===
                    // Ini khusus buat Bot & Friend biar ga berubah sama sekali
                    <>
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

                      <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span>🕐</span>
                        <span>
                          {game.timestamp?.seconds
                            ? new Date(
                                game.timestamp.seconds * 1000
                              ).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer tetep sama */}
      <footer className="mt-10 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Made with 💜 by Ftih07
          </p>
        </div>
      </footer>
    </div>
  );
}
