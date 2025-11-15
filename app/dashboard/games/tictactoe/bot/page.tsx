"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  getEasyMove,
  getMediumMove,
  getHardMove,
  Symbol,
} from "@/lib/tictactoeAI";

export default function PlayWithBot() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [board, setBoard] = useState<Symbol[]>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const [botSymbol, setBotSymbol] = useState<"X" | "O" | null>(null);
  const [turn, setTurn] = useState<"player" | "bot">("player");
  const [winner, setWinner] = useState<string | null>(null);

  // Cek pemenang
  const checkWinner = (squares: Symbol[]) => {
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
    return squares.includes(null) ? null : "draw";
  };

  // Player klik
  const handleClick = (index: number) => {
    if (winner || board[index] || turn !== "player") return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      saveResult(result);
    } else {
      setTurn("bot");
    }
  };

  // Bot move
  useEffect(() => {
    if (turn === "bot" && !winner && botSymbol && playerSymbol) {
      const timer = setTimeout(() => {
        let moveIndex: number;

        if (difficulty === "easy") {
          moveIndex = getEasyMove(board);
        } else if (difficulty === "medium") {
          moveIndex = getMediumMove(board, botSymbol, playerSymbol);
        } else {
          moveIndex = getHardMove(board, botSymbol, playerSymbol);
        }

        const newBoard = [...board];
        newBoard[moveIndex] = botSymbol;
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
          setWinner(result);
          saveResult(result);
        } else {
          setTurn("player");
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [turn]);

  // Simpan hasil ke Firestore
  const saveResult = async (result: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const outcome =
      result === playerSymbol ? "win" : result === botSymbol ? "lose" : "draw";

    try {
      await addDoc(collection(db, "games"), {
        userId: user.uid,
        mode: "bot",
        difficulty,
        result: outcome,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to save game:", err);
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setTurn(playerSymbol === "X" ? "player" : "bot");
  };

  // Pilih level dulu
  if (!difficulty) {
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
              <span className="text-2xl">🤖</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Main Lawan Bot
              </h1>
            </div>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-12 min-h-[calc(100vh-180px)]">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <span className="text-8xl block">🤖</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pilih Tingkat Kesulitan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Seberapa sulit kamu ingin bermain?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            <button
              onClick={() => setDifficulty("easy")}
              className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">😊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Mudah
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Cocok untuk pemula
              </p>
            </button>

            <button
              onClick={() => setDifficulty("medium")}
              className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤔</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Sedang
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tantangan seimbang
              </p>
            </button>

            <button
              onClick={() => setDifficulty("hard")}
              className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">😤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Sulit
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Untuk yang pro!
              </p>
            </button>
          </div>
        </main>

        <footer className="py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Made with 💜 by Ftih07</p>
        </footer>
      </div>
    );
  }

  // Pilih simbol
  if (!playerSymbol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <button
              onClick={() => setDifficulty(null)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <span>←</span>
              <span className="font-medium">Kembali</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl capitalize font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Mode: {difficulty}
              </span>
            </div>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-12 min-h-[calc(100vh-180px)]">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <span className="text-8xl block">✨</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pilih Simbol Kamu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">X atau O?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
            <button
              onClick={() => {
                setPlayerSymbol("X");
                setBotSymbol("O");
                setTurn("player");
              }}
              className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-5xl font-bold text-white">X</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Simbol X
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kamu main duluan
              </p>
            </button>

            <button
              onClick={() => {
                setPlayerSymbol("O");
                setBotSymbol("X");
                setTurn("bot");
              }}
              className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-5xl font-bold text-white">O</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Simbol O
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bot main duluan
              </p>
            </button>
          </div>
        </main>

        <footer className="py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Made with 💜 by Ftih07</p>
        </footer>
      </div>
    );
  }

  // Board
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
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent capitalize">
              TicTacToe • {difficulty}
            </h1>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Player Info */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl px-6 py-3 text-white shadow-lg">
              <p className="text-sm font-medium mb-1">Kamu</p>
              <p className="text-3xl font-bold">{playerSymbol}</p>
            </div>
            <div className="flex items-center">
              <span className="text-2xl text-gray-400">VS</span>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl px-6 py-3 text-white shadow-lg">
              <p className="text-sm font-medium mb-1">Bot</p>
              <p className="text-3xl font-bold">{botSymbol}</p>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-white text-lg font-bold">
                {winner
                  ? winner === "draw"
                    ? "🤝 Hasil: Seri!"
                    : winner === playerSymbol
                    ? "🎉 Kamu Menang!"
                    : "😢 Kamu Kalah"
                  : turn === "player"
                  ? "🎯 Giliran Kamu"
                  : "🤖 Bot Sedang Berpikir..."}
              </p>
            </div>
          </div>

          {/* Game Board */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-inner">
              {board.map((val, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  disabled={turn !== "player" || !!winner || !!val}
                  className={`
                    w-20 h-20 sm:w-24 sm:h-24 
                    bg-white dark:bg-gray-700 
                    rounded-xl text-4xl sm:text-5xl font-bold 
                    shadow-md hover:shadow-xl
                    transition-all duration-200
                    disabled:cursor-not-allowed
                    ${
                      turn === "player" && !winner && !val
                        ? "hover:scale-105 hover:bg-blue-50 dark:hover:bg-gray-600"
                        : ""
                    }
                    ${val === "X" ? "text-blue-600 dark:text-blue-400" : ""}
                    ${val === "O" ? "text-purple-600 dark:text-purple-400" : ""}
                  `}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          {winner && (
            <div className="flex justify-center gap-3">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span>🔄</span>
                Main Lagi
              </button>
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium capitalize">
              Mode: {difficulty}
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Auto Save
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Melawan AI
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
