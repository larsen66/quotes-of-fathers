import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function loadQuotesIncremental(lastSyncAt: string) {
  const q = query(
    collection(db, "quotes"),
    where("updatedAt", ">", lastSyncAt)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
