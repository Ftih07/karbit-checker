import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

// Fungsi untuk dapatkan tanggal hari ini (format YYYY-MM-DD)
function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export async function trackVisit() {
  try {
    const todayKey = getTodayKey();
    const visitRef = doc(db, "visits", todayKey);
    const snap = await getDoc(visitRef);

    if (snap.exists()) {
      await updateDoc(visitRef, {
        total: increment(1),
        lastUpdated: new Date().toISOString(),
      });
    } else {
      await setDoc(visitRef, {
        total: 1,
        unique: 1,
        lastUpdated: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Error tracking visit:", err);
  }
}
