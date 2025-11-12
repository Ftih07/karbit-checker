"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Sidebar from "../components/Sidebar";

interface Option {
  label: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

export default function QuestionsCMS() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([{ label: "", score: 0 }]);
  const [adminEmail, setAdminEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // 🔐 Ambil email admin yang login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setAdminEmail(user.email || "");
    });
    return () => unsubscribe();
  }, []);

  // 📦 Ambil data pertanyaan
  const fetchQuestions = async () => {
    const snapshot = await getDocs(collection(db, "questions"));
    const data = snapshot.docs.map(
      (docSnap) =>
        ({
          id: docSnap.id,
          ...docSnap.data(),
        } as Question)
    );
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ➕ Tambah opsi baru
  const handleAddOption = () => {
    setOptions((prev) => [...prev, { label: "", score: 0 }]);
  };

  // ❌ Hapus opsi
  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  // ✏️ Ubah nilai option
  const handleOptionChange = (
    index: number,
    field: keyof Option,
    value: string | number
  ) => {
    setOptions((prev) =>
      prev.map((opt, i) =>
        i === index
          ? {
              ...opt,
              [field]: field === "score" ? Number(value) : String(value),
            }
          : opt
      )
    );
  };

  // 💾 Tambah atau update pertanyaan
  const handleSaveQuestion = async () => {
    if (!newQuestion.trim()) return alert("Pertanyaan tidak boleh kosong!");
    const cleanOptions = options.filter((opt) => opt.label.trim() !== "");

    if (editingId) {
      // 🔁 Mode edit
      await updateDoc(doc(db, "questions", editingId), {
        text: newQuestion,
        options: cleanOptions,
      });
      setEditingId(null);
    } else {
      // ➕ Mode tambah
      await addDoc(collection(db, "questions"), {
        text: newQuestion,
        options: cleanOptions,
      });
    }

    setNewQuestion("");
    setOptions([{ label: "", score: 0 }]);
    fetchQuestions();
  };

  // 🗑️ Hapus pertanyaan
  const handleDelete = async (id: string) => {
    if (confirm("Yakin mau hapus pertanyaan ini?")) {
      await deleteDoc(doc(db, "questions", id));
      fetchQuestions();
    }
  };

  // ✏️ Edit pertanyaan
  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setNewQuestion(question.text);
    setOptions(question.options);
    // Scroll to top untuk melihat form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ❌ Batalkan edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewQuestion("");
    setOptions([{ label: "", score: 0 }]);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <Sidebar email={adminEmail} />
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kelola Pertanyaan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Tambah, edit, atau hapus pertanyaan untuk quiz Anda
            </p>
          </div>

          {/* Add / Edit Question Form */}
          <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg mb-8 border border-indigo-100 dark:border-indigo-900/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  {editingId ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {editingId ? "Edit Pertanyaan" : "Tambah Pertanyaan Baru"}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Question Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Teks Pertanyaan
                  </label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Masukkan pertanyaan Anda..."
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400"
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Opsi Jawaban
                    </label>
                    <button
                      onClick={handleAddOption}
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/30"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Tambah Opsi
                    </button>
                  </div>

                  <div className="space-y-3">
                    {options.map((option, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) =>
                              handleOptionChange(i, "label", e.target.value)
                            }
                            placeholder={`Opsi ${i + 1}`}
                            className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            value={option.score}
                            onChange={(e) =>
                              handleOptionChange(
                                i,
                                "score",
                                Number(e.target.value)
                              )
                            }
                            placeholder="Skor"
                            className="w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-center text-gray-800 dark:text-gray-200 placeholder-gray-400"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveOption(i)}
                          className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-lg shadow-red-500/30"
                          title="Hapus opsi"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveQuestion}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-lg ${
                      editingId
                        ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-yellow-500/30"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/30"
                    } text-white`}
                  >
                    {editingId ? (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Perbarui Pertanyaan
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Simpan Pertanyaan
                      </>
                    )}
                  </button>

                  {editingId && (
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-gray-500/30"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* List Questions */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Daftar Pertanyaan ({questions.length})
              </h2>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                  <svg
                    className="w-12 h-12 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Belum ada pertanyaan. Tambahkan pertanyaan pertama Anda!
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {questions.map((q, index) => (
                  <li
                    key={q.id}
                    className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all border border-indigo-100 dark:border-indigo-900/30"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold rounded-lg shadow-lg">
                              {index + 1}
                            </span>
                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                              {q.text}
                            </p>
                          </div>

                          <div className="ml-11 space-y-2">
                            {q.options.map((opt, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-indigo-50/50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg"
                              >
                                <span className="flex items-center justify-center w-6 h-6 bg-indigo-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="flex-1">{opt.label}</span>
                                <span className="flex items-center gap-1 text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                  </svg>
                                  {opt.score}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(q)}
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-yellow-500/30"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-red-500/30"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
