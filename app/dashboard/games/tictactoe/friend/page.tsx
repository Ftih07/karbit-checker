"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function TicTacToePage() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [playerX, setPlayerX] = useState("Player X");
  const [playerO, setPlayerO] = useState("Player O");
  const [gameFinished, setGameFinished] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);
  const [showSaveNotif, setShowSaveNotif] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  // Mengecek pemenang
  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    if (squares.every(Boolean)) return "draw";
    return null;
  };

  // Handle klik kotak
  const handleClick = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";

    const newMoves = [...moves, `${xIsNext ? "X" : "O"}:${index}`];
    const result = calculateWinner(newBoard);

    setBoard(newBoard);
    setMoves(newMoves);
    setXIsNext(!xIsNext);
    setWinner(result);
    if (result) setGameFinished(true);
  };

  // Simpan hasil ke Firestore
  const saveGameResult = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "games"), {
        userId: user.uid,
        mode: "friend",
        winner,
        players: {
          X: playerX,
          O: playerO,
        },
        moves,
        timestamp: Timestamp.now(),
      });
      setShowSaveNotif(true);
      setTimeout(() => setShowSaveNotif(false), 3000);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      alert("Gagal menyimpan hasil game!");
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameFinished(false);
    setMoves([]);
    setShowSaveNotif(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Header */}
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
            <span className="text-2xl">👥</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Main Bareng Teman
            </h1>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Success Notification */}
      {showSaveNotif && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">✓</span>
            <span className="font-medium">Hasil game berhasil disimpan!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Player Names Input */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>👤</span>
            Nama Pemain
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Pemain X
              </label>
              <input
                type="text"
                placeholder="Masukkan nama Player X"
                value={playerX}
                onChange={(e) => setPlayerX(e.target.value)}
                disabled={moves.length > 0}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Pemain O
              </label>
              <input
                type="text"
                placeholder="Masukkan nama Player O"
                value={playerO}
                onChange={(e) => setPlayerO(e.target.value)}
                disabled={moves.length > 0}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>
        </div>

        {/* Game Board Container */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Status Display */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-white text-lg font-bold">
                {winner
                  ? winner === "draw"
                    ? "🤝 Hasil: Seri!"
                    : `🎉 Pemenang: ${winner === "X" ? playerX : playerO}`
                  : `🎯 Giliran: ${xIsNext ? playerX : playerO}`}
              </p>
            </div>
          </div>

          {/* Game Board */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-inner">
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  disabled={!!winner || !!cell}
                  className={`
                    w-20 h-20 sm:w-24 sm:h-24 
                    bg-white dark:bg-gray-700 
                    rounded-xl text-4xl sm:text-5xl font-bold 
                    shadow-md hover:shadow-xl
                    transition-all duration-200
                    disabled:cursor-not-allowed
                    ${
                      !winner && !cell
                        ? "hover:scale-105 hover:bg-blue-50 dark:hover:bg-gray-600"
                        : ""
                    }
                    ${cell === "X" ? "text-blue-600 dark:text-blue-400" : ""}
                    ${
                      cell === "O" ? "text-purple-600 dark:text-purple-400" : ""
                    }
                  `}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {gameFinished && !showSaveNotif && (
              <button
                onClick={saveGameResult}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span>💾</span>
                Simpan Hasil
              </button>
            )}
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span>🔄</span>
              Reset Game
            </button>
          </div>

          {/* Move History */}
          {moves.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                <span>📝</span>
                Riwayat Langkah ({moves.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {moves.map((move, idx) => {
                  const [symbol, position] = move.split(":");
                  return (
                    <span
                      key={idx}
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium
                        ${
                          symbol === "X"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        }
                      `}
                    >
                      {symbol} → {parseInt(position) + 1}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Mode 2 Pemain
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Giliran: Bergantian
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Tiga Baris Menang
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Made with 💜 by Ftih07</p>
      </footer>
    </div>
  );
}
