import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

export function useContent<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, path);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data() as T);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, path);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, [path]);

  const update = async (newData: Partial<T>) => {
    try {
      const docRef = doc(db, path);
      await setDoc(docRef, {
        ...newData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  return { data, loading, error, update };
}
