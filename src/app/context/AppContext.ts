import { createContext, useContext } from "react";
import type { AppState, Transaction, Role, FilterGroup } from "@/shared/types/finance";

type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "SET_ROLE"; payload: Role }
  | { type: "SET_FILTERS"; payload: FilterGroup[] };

export type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addTx: (tx: Transaction) => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

