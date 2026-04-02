import type { Transaction } from "@/shared/types/finance";

const DB_NAME = "FinanceDashboardDB";
const STORE_NAME = "transactions";
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const addTransaction = async (
  transaction: Transaction,
): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(transaction);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const saveTransactions = async (
  transactions: Transaction[],
): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      transactions.forEach((txData) => store.add(txData));
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    clearRequest.onerror = () => reject(clearRequest.error);
  });
};
