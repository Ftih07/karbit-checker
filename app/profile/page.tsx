"use client";

import { useEffect, useState, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { CLOUDINARY_API_URL, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 🟦 Ambil data user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setEmail(currentUser.email || "");

        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || "");
          setAvatar(
            data.avatar ||
              `https://api.dicebear.com/9.x/bottts/svg?seed=${
                data.username || "user"
              }`
          );
        } else {
          await setDoc(userRef, {
            email: currentUser.email,
            username: "",
            avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${currentUser.uid}`,
          });
          setAvatar(
            `https://api.dicebear.com/9.x/bottts/svg?seed=${currentUser.uid}`
          );
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const provider = user.providerData[0]?.providerId;

  // 🟣 Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  // 🟢 Handle file input manual
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // 🟡 Simpan file ke state preview
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 🔵 Upload ke Cloudinary
  const handleUpload = async () => {
    if (!preview || !user) return;
    setUploading(true);
    try {
      const blob = await fetch(preview).then((r) => r.blob());
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        setAvatar(data.secure_url);
        await updateDoc(doc(db, "users", user.uid), {
          avatar: data.secure_url,
        });
        setPreview(null);
        alert("✅ Foto profil berhasil diperbarui!");
      } else throw new Error("Upload gagal");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal mengunggah gambar");
    }
    setUploading(false);
  };

  // 🟩 Simpan perubahan user profile (dengan cek username unik)
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 🟢 Cek apakah username sudah dipakai user lain
      if (username.trim() !== "") {
        const q = query(
          collection(db, "users"),
          where("username", "==", username.trim())
        );
        const snapshot = await getDocs(q);

        // Kalau ada dokumen dengan username sama dan bukan milik user sendiri
        const isTaken = snapshot.docs.some((doc) => doc.id !== user.uid);

        if (isTaken) {
          alert("⚠️ Username sudah digunakan. Pilih username lain.");
          setSaving(false);
          return;
        }
      }

      // 🟣 Update Firestore (username, avatar, dsb)
      await setDoc(
        doc(db, "users", user.uid),
        { username: username.trim() },
        { merge: true }
      );

      // 🟡 Update email (hanya kalau provider email/password)
      if (provider === "password" && email !== user.email) {
        await updateEmail(user, email);
      }

      // 🔵 Update password (opsional)
      if (provider === "password" && newPassword.trim() !== "") {
        await updatePassword(user, newPassword);
        alert("🔐 Password berhasil diperbarui!");
      }

      alert("✅ Profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("⚠️ Gagal memperbarui profil. Silakan login ulang.");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Card Container */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profil Saya 👤
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola informasi dan foto profil kamu
            </p>
          </div>

          {/* Avatar Upload Section */}
          <div className="mb-8">
            <div
              className={`relative border-3 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                isDragging
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                {/* Avatar Display */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500 shadow-xl">
                    <img
                      src={preview || avatar}
                      alt="Profil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {preview && (
                    <button
                      onClick={() => setPreview(null)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg transition-all duration-200"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Instructions */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 text-center">
                  📸 Seret & lepas foto atau klik tombol di bawah
                </p>

                {/* File Input */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    disabled={uploading}
                    className="hidden"
                  />
                  <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg">
                    Pilih Foto
                  </span>
                </label>

                {/* Upload Button */}
                {preview && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Mengunggah..." : "✓ Unggah Foto"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Masukkan username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled={provider !== "password"}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                  provider !== "password"
                    ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                }`}
              />
              {provider !== "password" && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  📧 Email dari {provider.replace(".com", "")} tidak dapat diubah
                </p>
              )}
            </div>

            {/* Password (only for email/password users) */}
            {provider === "password" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
            </button>

            {/* Provider Info */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                🔐 Provider: <span className="font-semibold">{provider.replace(".com", "")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          Made with 💜 by Ftih07
        </p>
      </div>
    </div>
  );
}