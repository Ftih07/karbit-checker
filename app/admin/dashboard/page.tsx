"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Sidebar from "./components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VisitData {
  date: string;
  total: number;
  unique: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [questionCount, setQuestionCount] = useState(0);

  // Quick stats
  const totalVisits = visits.reduce((sum, v) => sum + v.total, 0);
  const avgDaily = visits.length ? Math.round(totalVisits / visits.length) : 0;
  const peakDay = visits.reduce((max, v) => (v.total > max.total ? v : max), {
    date: "-",
    total: 0,
    unique: 0,
  });
  const todayKey = new Date().toISOString().split("T")[0];
  const todayVisits = visits.find((v) => v.date === todayKey)?.total || 0;

  const activeDays = visits.length;

  // ✅ Cek user admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "admin") {
          router.push("/admin/login");
          return;
        }

        setAdminEmail(user.email || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ Ambil data statistik visit + pertanyaan
  useEffect(() => {
    async function fetchData() {
      try {
        // Ambil visits
        const q = query(collection(db, "visits"), orderBy("__name__"));
        const snapshot = await getDocs(q);
        const data: VisitData[] = snapshot.docs.map((doc) => ({
          date: doc.id,
          total: doc.data().total || 0,
          unique: doc.data().unique || 0,
        }));
        setVisits(data);

        // Ambil jumlah pertanyaan
        const questionsSnap = await getDocs(collection(db, "questions"));
        setQuestionCount(questionsSnap.size);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading dashboard...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar email={adminEmail} />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-400 mb-2">Today Visits</h3>
            <p className="text-3xl font-bold">{todayVisits}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-400 mb-2">Total Visits</h3>
            <p className="text-3xl font-bold">{totalVisits}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-400 mb-2">Avg Daily</h3>
            <p className="text-3xl font-bold">{avgDaily}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-400 mb-2">Total Questions</h3>
            <p className="text-3xl font-bold">{questionCount}</p>
          </div>
        </div>

        {/* Traffic Trend Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Traffic Trend (7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visits.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-400 mb-2">Peak Day</h3>
            <p className="text-2xl font-bold">{peakDay.total} visits</p>
            <p className="text-sm text-gray-500">{peakDay.date}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-400 mb-2">Active Days</h3>
            <p className="text-2xl font-bold">{activeDays} days</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-400 mb-2">Engagement Rate</h3>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-sm text-gray-500">Days with activity</p>
          </div>
        </div>
      </div>  
    </div>
  );
}
