/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Transaction, Role, FilterGroup, AppState } from "@/types";
import { getTransactions, addTransaction as dbAddTransaction, saveTransactions } from "@/shared/lib/db";
import { MOCK_TRANSACTIONS } from "@/data/mockData";

type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "SET_ROLE"; payload: Role }
  | { type: "SET_FILTERS"; payload: FilterGroup[] };

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addTx: (tx: Transaction) => Promise<void>;
};

const initialState: AppState = {
  transactions: [],
  role: "admin", // Default to admin
  filterGroups: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [...state.transactions, action.payload] };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILTERS":
      return { ...state, filterGroups: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initData = async () => {
      try {
        let txs = await getTransactions();
        // Seed database with mock data if it's completely empty on first run
        if (txs.length === 0) {
          await saveTransactions(MOCK_TRANSACTIONS);
          txs = MOCK_TRANSACTIONS;
        }
        dispatch({ type: "SET_TRANSACTIONS", payload: txs });
      } catch (error) {
        console.error("Failed to load transactions", error);
      }
    };
    initData();
  }, []);

  const addTx = async (tx: Transaction) => {
    try {
      await dbAddTransaction(tx);
      dispatch({ type: "ADD_TRANSACTION", payload: tx });
    } catch (error) {
      console.error("Failed to add transaction to IndexedDB", error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addTx }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
