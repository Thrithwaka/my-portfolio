import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

export function useCollection<T>(collectionPath: string, orderField: string = 'createdAt') {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionPath), orderBy(orderField, 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as (T & { id: string })[];
      setData(docs);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, collectionPath);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionPath, orderField]);

  const add = async (newData: T) => {
    try {
      await addDoc(collection(db, collectionPath), {
        ...newData,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, collectionPath);
    }
  };

  const update = async (id: string, newData: Partial<T>) => {
    try {
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, {
        ...newData,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${collectionPath}/${id}`);
    }
  };

  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionPath}/${id}`);
    }
  };

  return { data, loading, error, add, update, remove };
}
