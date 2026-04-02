import React, { useReducer, useEffect } from "react";
import { AppContext } from "@/app/context/AppContext";
import type { Transaction, Role, FilterGroup, AppState } from "@/shared/types/finance";
import {
  getTransactions,
  addTransaction as dbAddTransaction,
  saveTransactions,
} from "@/features/transactions/lib/transactionsDb";
import { MOCK_TRANSACTIONS } from "@/data/mockData";

type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "SET_ROLE"; payload: Role }
  | { type: "SET_FILTERS"; payload: FilterGroup[] };

const initialState: AppState = {
  transactions: [],
  role: "admin",
  filterGroups: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILTERS":
      return { ...state, filterGroups: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initData = async () => {
      try {
        let txs = await getTransactions();
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
      console.error("Failed to add transaction", error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addTx }}>
      {children}
    </AppContext.Provider>
  );
};

