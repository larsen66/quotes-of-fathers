import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function loadFathersIncremental(lastSyncAt: string) {
  const q = query(
    collection(db, "fathers"),
    where("updatedAt", ">", lastSyncAt)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
