"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid"; // Install dulu: npm i nanoid (opsional, pake Math.random juga bisa)

export default function MultiplayerLobby() {
  const router = useRouter();
  const [inputRoomId, setInputRoomId] = useState("");

  const createRoom = () => {
    // Generate ID acak pendek, misal: "xkq-92a"
    const roomId = nanoid(6); 
    router.push(`/dashboard/games/tictactoe/multiplayer/${roomId}`);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoomId.trim()) {
      router.push(`/dashboard/games/tictactoe/multiplayer/${inputRoomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Multiplayer Tic Tac Toe
        </h1>

        <div className="space-y-6">
          {/* Create Room */}
          <button
            onClick={createRoom}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg transform transition hover:scale-[1.02]"
          >
            ➕ Buat Room Baru
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">ATAU JOIN</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Join Room */}
          <form onSubmit={joinRoom} className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan ID Room..."
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition"
            >
              Masuk
            </button>
          </form>
          
          <button 
            onClick={() => router.push('/dashboard/games/tictactoe')}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-4"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
}