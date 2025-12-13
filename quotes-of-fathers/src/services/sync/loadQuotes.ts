import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function loadQuotes() {
  const q = query(
    collection(db, "quotes"),
    where("isPublished", "==", true),
    where("deleted", "!=", true)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
