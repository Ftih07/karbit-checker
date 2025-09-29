"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { uploadImage } from "@/lib/uploadImage";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Trophy, Upload, Check, Sparkles, Camera, User } from "lucide-react";

const DICEBEAR_STYLES = ["bottts", "adventurer", "fun-emoji", "notionists"];

// Komponen yang benar-benar pakai useSearchParams
function ResultContent() {
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const saveToLeaderboard = async () => {
    if (!score || !name) return;
    setLoading(true);

    try {
      let avatarUrl = `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${name}`;
      if (file) {
        const uploadRes = await uploadImage(file);
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
    } finally {
      setLoading(false);
    }
  };

  const getScoreCategory = (s: number) => {
    if (s >= 80)
      return {
        text: "Karbit Banget! 🔥",
        color:
          "from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500",
        emoji: "🔥",
      };
    if (s >= 60)
      return {
        text: "Lumayan Karbit! ⚡",
        color:
          "from-yellow-600 to-orange-600 dark:from-yellow-500 dark:to-orange-500",
        emoji: "⚡",
      };
    if (s >= 40)
      return {
        text: "Standar Aja 😎",
        color: "from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500",
        emoji: "😎",
      };
    return {
      text: "Santuy Banget 🌿",
      color: "from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500",
      emoji: "🌿",
    };
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

      {/* … sisanya sama persis dengan konten kamu … */}
      {/* tinggal pindahkan seluruh JSX yang kamu tulis tadi ke sini */}
    </main>
  );
}

// Halaman utama membungkus dengan Suspense
export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <ResultContent />
    </Suspense>
  );
}
