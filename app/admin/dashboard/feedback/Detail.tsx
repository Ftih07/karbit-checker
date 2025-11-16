"use client";

import { formatDate } from "./utils";
import { Timestamp } from "firebase/firestore";

interface Report {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  images: string[];
  createdAt: Timestamp | null;
}

interface DetailProps {
  report: Report;
  onClose: () => void;
  onDelete: () => void;
}

export default function Detail({ report, onClose, onDelete }: DetailProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md p-4 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-700">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 sm:p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>📋</span>
              <span>Detail Laporan</span>
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition-all"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl p-4 sm:p-5 border-2 border-indigo-200 dark:border-indigo-800">
            <div className="flex items-start gap-3 sm:gap-4">

              {/* Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                {report.name?.charAt(0).toUpperCase()}
              </div>

              {/* User Details */}
              <div className="flex-1 space-y-3 min-w-0">

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    👤 Nama Lengkap
                  </p>
                  <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white break-words">
                    {report.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      ✉️ Email
                    </p>
                    <a
                      href={`mailto:${report.email}`}
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline break-all block"
                    >
                      {report.email}
                    </a>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      📱 Nomor Telepon
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.phone ? (
                        report.phone
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada</span>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    🕒 Tanggal Laporan
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(report.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💬</span>
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                Isi Pesan
              </h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
              <p className="whitespace-pre-wrap text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                {report.message}
              </p>
            </div>
          </div>

          {/* Images */}
          {report.images && report.images.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🖼️</span>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                  Lampiran Gambar ({report.images.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {report.images.map((url: string, i: number) => (
                  <div
                    key={i}
                    className="group relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all"
                  >
                    <img
                      src={url}
                      alt={`Lampiran ${i + 1}`}
                      className="w-full h-auto object-cover"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
                      >
                        🔍 Buka Gambar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/90 backdrop-blur-sm p-5 sm:p-6 rounded-b-2xl border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">

            <button
              onClick={onDelete}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>🗑️</span>
              <span>Hapus Laporan</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              ✕ Tutup
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
