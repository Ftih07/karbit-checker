"use client";

import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  getDoc,
  arrayUnion,
  increment,
  Timestamp,
  FieldValue, // <--- TAMBAHKAN INI
} from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

// --- Tipe Data ---
type Player = {
  uid: string;
  name: string;
  score: number;
  email: string;
};

type ChatMessage = {
  sender: string;
  message: string;
  timestamp: number;
};

type GameData = {
  roomId: string;
  status: "waiting" | "playing";
  board: (string | null)[];
  xIsNext: boolean;
  winner: string | null;
  players: {
    X: Player | null;
    O: Player | null;
  };
  chat: ChatMessage[];
  rematch: { X: boolean; O: boolean };
  lastStarter: "X" | "O";
  createdAt: Timestamp;
};

export default function MultiplayerGameRoom() {
  const params = useParams();
  // PERBAIKAN: Sesuaikan dengan nama folder [roomId]
  const roomId = params.roomId as string;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [copyStatus, setCopyStatus] = useState("Share Room");
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Helper: Calculate Winner (Dipindah ke luar atau di atas handleMove) ---
  const calculateWinner = (squares: (string | null)[]) => {
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return squares[a];
    }
    return null;
  };

  // 1. Cek Auth & Load Game Realtime
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currUser) => {
      if (!currUser) {
        // Redirect ke login jika belum login, simpan return url agar balik lagi kesini
        router.push(
          `/login?redirect=/dashboard/games/tictactoe/multiplayer/${roomId}`
        );
        return;
      }
      setUser(currUser);

      if (!roomId) return; // Guard clause jika roomId belum ready

      const gameRef = doc(db, "games", roomId);

      const snap = await getDoc(gameRef);
      if (!snap.exists()) {
        // Logic Create Room Baru
        await setDoc(gameRef, {
          roomId,
          status: "waiting",
          board: Array(9).fill(null),
          xIsNext: true,
          winner: null,
          lastStarter: "X",
          players: {
            X: {
              uid: currUser.uid,
              name: currUser.displayName || "Player 1",
              score: 0,
              email: currUser.email || "",
            },
            O: null,
          },
          chat: [],
          rematch: { X: false, O: false },
          createdAt: Timestamp.now(),
        });
      } else {
        // Logic Join Room
        const data = snap.data() as GameData;
        // Jika Player O masih kosong DAN yang join bukan Player X
        if (!data.players.O && data.players.X?.uid !== currUser.uid) {
          await updateDoc(gameRef, {
            "players.O": {
              uid: currUser.uid,
              name: currUser.displayName || "Player 2",
              score: 0,
              email: currUser.email || "",
            },
            status: "playing",
          });
        }
      }

      // Realtime Listener
      const unsubGame = onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
          setGameData(doc.data() as GameData);
        }
      });

      return () => unsubGame();
    });

    return () => unsubAuth();
  }, [roomId, router]);

  // Auto scroll chat setiap ada pesan baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameData?.chat]);

  // --- Logic Game ---

  const myRole =
    gameData?.players.X?.uid === user?.uid
      ? "X"
      : gameData?.players.O?.uid === user?.uid
      ? "O"
      : "SPECTATOR";
  const isMyTurn =
    gameData?.status === "playing" &&
    !gameData.winner &&
    ((gameData.xIsNext && myRole === "X") ||
      (!gameData.xIsNext && myRole === "O"));

  const handleMove = async (index: number) => {
    if (!gameData || !isMyTurn || gameData.board[index]) return;

    const newBoard = [...gameData.board];
    newBoard[index] = myRole;

    const winner = calculateWinner(newBoard);

    const updates: Record<
      string,
      (string | null)[] | boolean | string | null | FieldValue
    > = {
      board: newBoard,
      xIsNext: !gameData.xIsNext,
    };

    if (winner) {
      updates.winner = winner;
      if (winner === "X") updates["players.X.score"] = increment(1);
      if (winner === "O") updates["players.O.score"] = increment(1);
    } else if (newBoard.every(Boolean)) {
      updates.winner = "draw";
    }

    await updateDoc(doc(db, "games", roomId), updates);
  };

  const handleRematch = async () => {
    if (!gameData || !user || myRole === "SPECTATOR") return;

    await updateDoc(doc(db, "games", roomId), {
      [`rematch.${myRole}`]: true,
    });

    // Cek logic local untuk antisipasi UI update instan (opsional), tapi logic utamanya di server trigger
    // Di sini kita cek data yang ada di state
    const opponentRole = myRole === "X" ? "O" : "X";
    if (gameData.rematch[opponentRole]) {
      // Jika lawan SUDAH true duluan, berarti sekarang keduanya true -> RESET
      const nextStarter = gameData.lastStarter === "X" ? "O" : "X";
      await updateDoc(doc(db, "games", roomId), {
        board: Array(9).fill(null),
        winner: null,
        rematch: { X: false, O: false },
        lastStarter: nextStarter,
        xIsNext: nextStarter === "X",
      });
    }
  };

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;

    await updateDoc(doc(db, "games", roomId), {
      chat: arrayUnion({
        sender: user?.displayName || "Player",
        message: chatMsg,
        timestamp: Date.now(),
      }),
    });
    setChatMsg("");
  };

  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Share Room"), 2000);
  };

  if (!gameData)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Connecting to Server...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* --- AREA GAME (KIRI) --- */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center">
        {/* Header Info */}
        <div className="w-full max-w-lg mb-6 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="font-bold text-xl text-gray-800 dark:text-white">
              Room: <span className="font-mono text-blue-600">{roomId}</span>
            </h1>
            <p className="text-xs text-gray-500">
              {myRole === "SPECTATOR" ? "👀 Mode Penonton" : "🎮 Mode Bermain"}
            </p>
          </div>
          <button
            onClick={copyRoomLink}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition border border-blue-200"
          >
            {copyStatus}
          </button>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8">
          {/* Player X */}
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              gameData.xIsNext && !gameData.winner
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                : "border-transparent bg-white dark:bg-gray-800 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                X
              </div>
              <span className="font-bold truncate dark:text-white text-sm sm:text-base">
                {gameData.players.X?.name}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {gameData.players.X?.score || 0}{" "}
              <span className="text-xs text-gray-400 font-normal">pts</span>
            </div>
          </div>

          {/* Player O */}
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              !gameData.xIsNext && !gameData.winner
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                : "border-transparent bg-white dark:bg-gray-800 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                O
              </div>
              <span className="font-bold truncate dark:text-white text-sm sm:text-base">
                {gameData.players.O ? gameData.players.O.name : "Waiting..."}
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {gameData.players.O?.score || 0}{" "}
              <span className="text-xs text-gray-400 font-normal">pts</span>
            </div>
          </div>
        </div>

        {/* Notifikasi Status */}
        {gameData.status === "waiting" && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-lg mb-6 flex items-center gap-2 animate-pulse">
            <span>⏳</span> Menunggu lawan bergabung...
          </div>
        )}

        {/* GAME BOARD */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl shadow-inner">
            {gameData.board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleMove(i)}
                disabled={
                  !!cell ||
                  !!gameData.winner ||
                  !isMyTurn ||
                  gameData.status === "waiting"
                }
                className={`
                  w-20 h-20 md:w-24 md:h-24 rounded-xl text-4xl md:text-5xl font-bold flex items-center justify-center shadow-sm transition-all duration-200
                  ${
                    cell
                      ? "bg-white dark:bg-gray-800 scale-100"
                      : "bg-gray-50 dark:bg-gray-600 hover:bg-white dark:hover:bg-gray-500 scale-95 hover:scale-100"
                  }
                  ${cell === "X" ? "text-blue-500" : "text-purple-500"}
                  ${
                    !cell && isMyTurn
                      ? "cursor-pointer ring-2 ring-blue-300 dark:ring-blue-800"
                      : "cursor-default"
                  }
                `}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Overlay Winner / Rematch */}
          {gameData.winner && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-300 z-10 p-4 text-center">
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                {gameData.winner === "draw"
                  ? "🤝 Seri!"
                  : `🏆 ${
                      gameData.winner === "X"
                        ? gameData.players.X?.name
                        : gameData.players.O?.name
                    } Menang!`}
              </h2>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <button
                  onClick={handleRematch}
                  disabled={
                    gameData.rematch[myRole as "X" | "O"] ||
                    myRole === "SPECTATOR"
                  }
                  className={`px-6 py-2 rounded-full font-bold transition shadow-lg flex items-center gap-2
                    ${
                      gameData.rematch[myRole as "X" | "O"]
                        ? "bg-gray-600 cursor-not-allowed opacity-80"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105"
                    }`}
                >
                  {gameData.rematch[myRole as "X" | "O"]
                    ? "⏳ Menunggu Lawan..."
                    : "🔄 Main Lagi"}
                </button>
                <button
                  onClick={() => router.push("/dashboard/games/tictactoe")}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full font-bold transition"
                >
                  Keluar
                </button>
              </div>

              {/* Status Rematch Lawan */}
              {myRole !== "SPECTATOR" && (
                <p className="text-xs mt-4 text-gray-300">
                  {gameData.rematch[myRole === "X" ? "O" : "X"]
                    ? "🔥 Lawan sudah siap!"
                    : "Menunggu respon lawan..."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- AREA CHAT (KANAN) --- */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 flex flex-col h-[50vh] md:h-screen shadow-xl z-20">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold dark:text-white flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <span>💬</span> Live Chat
          </div>
          <span className="text-xs font-normal text-gray-500">
            {gameData.players.O ? "Online" : "Offline"}
          </span>
        </div>

        {/* Chat List */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50"
          ref={scrollRef}
        >
          {gameData.chat.map((msg, idx) => {
            const isMe = msg.sender === (user?.displayName || "Player");
            return (
              <div
                key={idx}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.sender} •{" "}
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
          {gameData.chat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <span className="text-4xl mb-2">👋</span>
              <p className="text-sm">Sapa lawan mainmu!</p>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={sendChat}
          className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-800"
        >
          <input
            type="text"
            value={chatMsg}
            onChange={(e) => setChatMsg(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
          />
          <button
            type="submit"
            disabled={!chatMsg.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-md"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
