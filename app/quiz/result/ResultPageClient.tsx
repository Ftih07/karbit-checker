// app/quiz/result/ResultPageClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { uploadImage } from "@/lib/uploadImage";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Trophy, Upload, Check, Sparkles, Camera, User } from "lucide-react";

const DICEBEAR_STYLES = ["bottts", "adventurer", "fun-emoji", "notionists"];

type ScoreCategory = { text: string; color: string; emoji: string };

function getScoreCategory(s: number): ScoreCategory {
  if (s >= 80) return { text: "Karbit Banget! 🔥", color: "from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500", emoji: "🔥" };
  if (s >= 60) return { text: "Lumayan Karbit! ⚡", color: "from-yellow-600 to-orange-600 dark:from-yellow-500 dark:to-orange-500", emoji: "⚡" };
  if (s >= 40) return { text: "Standar Aja 😎", color: "from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500", emoji: "😎" };
  return { text: "Santuy Banget 🌿", color: "from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500", emoji: "🌿" };
}

export default function ResultPageClient() {
  const params = useSearchParams();
  const [score, setScore] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState("bottts");

  useEffect(() => {
    const s = Number(params.get("score")) || 0;
    setScore(s);
  }, [params]);

  // cleanup object URL when preview changes / component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        try {
          URL.revokeObjectURL(preview);
        } catch (e) {
          // ignore (some URLs like remote strings are safe)
        }
      }
    };
  }, [preview]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const objUrl = URL.createObjectURL(acceptedFiles[0]);
      setFile(acceptedFiles[0]);
      setPreview(objUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const saveToLeaderboard = async () => {
    if (!score && score !== 0) return;
    if (!name) return;
    setLoading(true);

    try {
      let avatarUrl = `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${encodeURIComponent(name)}`;
      if (file) {
        const uploadRes = await uploadImage(file);
        // expecting uploadImage to return { secure_url: string } — sesuai kode kamu sebelumnya
        avatarUrl = uploadRes.secure_url;
      }

      await addDoc(collection(db, "leaderboard"), {
        name,
        score,
        avatar: avatarUrl,
        style: file ? "upload" : avatarStyle,
        createdAt: serverTimestamp(),
      });

      setSaved(true);
    } catch (err) {
      console.error("Error saving:", err);
      // kamu bisa tambahkan toast/alert di sini
    } finally {
      setLoading(false);
    }
  };

  if (score === null) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  const category = getScoreCategory(score);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Score Display */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-full blur-xl opacity-50 animate-pulse`}></div>
              <div className={`relative bg-gradient-to-r ${category.color} p-6 rounded-full`}>
                <Trophy className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
            {category.text}
          </h1>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Skor: <span className={`bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>{score}</span>
            </p>
            <span className="text-2xl">{category.emoji}</span>
          </div>
        </div>

        {!saved ? (
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              Simpan ke Leaderboard 🏆
            </h2>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nama Kamu
              </label>
              <input
                type="text"
                placeholder="Masukin nama kamu..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Avatar Preview */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-25"></div>
                <div className="relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  ) : (
                    <img
                      src={`https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${encodeURIComponent(name || "random")}`}
                      alt="Avatar Preview"
                      className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Avatar Style Selector */}
            {!file && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Pilih Style Avatar
                </label>
                <div className="flex gap-2 flex-wrap justify-center">
                  {DICEBEAR_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setAvatarStyle(style)}
                      type="button"
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        avatarStyle === style
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${
                isDragActive
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 scale-105"
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {isDragActive ? (
                  <>
                    <Upload className="w-12 h-12 text-green-500 animate-bounce" />
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      Lepas gambar di sini...
                    </p>
                  </>
                ) : preview ? (
                  <>
                    <Camera className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Klik atau drag untuk ganti gambar
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveToLeaderboard}
              disabled={loading || !name}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Simpan ke Leaderboard
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Berhasil Disimpan! 🎉
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Skor kamu udah masuk ke leaderboard nih!
            </p>

            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Trophy className="w-5 h-5" />
              Lihat Leaderboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
