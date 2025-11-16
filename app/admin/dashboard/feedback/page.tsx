"use client";

import { useEffect, useState, useMemo } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Detail from "./Detail";
import { formatDate } from "./utils";
import { Report } from "./types";
import Sidebar from "../components/Sidebar";

export default function FeedbackPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [selected, setSelected] = useState<Report | null>(null);
  const [adminEmail, setAdminEmail] = useState("");

  // 🔐 Ambil email admin yang login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setAdminEmail(user.email || "");
    });
    return () => unsubscribe();
  }, []);

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Load real-time data
  useEffect(() => {
    const q = query(
      collection(db, "feedback_reports"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Report[] = snapshot.docs.map((d) => {
        const data = d.data();

        return {
          id: d.id,
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          message: data.message,
          images: data.images ?? [],
          createdAt: data.createdAt ?? null,
          read: data.read ?? false,
        };
      });

      setReports(list);
    });

    return () => unsub();
  }, []);

  // Search
  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const q = search.toLowerCase();
      return (
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.message?.toLowerCase().includes(q)
      );
    });
  }, [reports, search]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const da = a.createdAt?.seconds || 0;
      const db = b.createdAt?.seconds || 0;
      return sortNewest ? db - da : da - db;
    });
  }, [filtered, sortNewest]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  // Delete
  async function handleDelete(id: string) {
    if (!confirm("Hapus laporan ini?")) return;
    await deleteDoc(doc(db, "feedback_reports", id));
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 p-4 sm:p-6 lg:p-8">
      <Sidebar email={adminEmail} />

      <div className="max-w-7xl mx-auto ml-64">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                📋 Laporan Masuk
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total {sorted.length} laporan ditemukan
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  placeholder="🔍 Cari laporan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-60 pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort */}
              <button
                onClick={() => setSortNewest(!sortNewest)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <span>{sortNewest ? "📅 Terbaru" : "📅 Terlama"}</span>
                <span className="text-lg">{sortNewest ? "↓" : "↑"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="grid gap-4 mb-6">
          {paginated.map((r) => (
            <div
              key={r.id}
              className="group bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
              onClick={() => setSelected(r)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {r.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
                        {r.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        ✉️ {r.email}
                      </p>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {r.message}
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      🕒 {formatDate(r.createdAt)}
                    </span>
                    {r.phone && (
                      <span className="flex items-center gap-1">
                        📱 {r.phone}
                      </span>
                    )}
                    {r.images?.length > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                        🖼️ {r.images.length} gambar
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge Status */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {!r.read && (
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg animate-pulse">
                      🔴 Baru
                    </span>
                  )}
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    👁️
                  </span>
                </div>
              </div>
            </div>
          ))}

          {paginated.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                Tidak ada laporan ditemukan
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {search
                  ? "Coba kata kunci pencarian yang berbeda"
                  : "Belum ada laporan masuk"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 sm:px-6 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
            >
              ← Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all text-sm ${
                      page === pageNum
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 sm:px-6 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <Detail
          report={selected}
          onClose={() => setSelected(null)}
          onDelete={() => handleDelete(selected.id!)}
        />
      )}
    </div>
  );
}