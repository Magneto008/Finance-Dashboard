import type { Transaction } from "@/types";
import * as xlsx from "xlsx";

/**
 * Trigger file download via Blob wrapper
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions: Transaction[]) => {
  const data = JSON.stringify(transactions, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  downloadBlob(blob, "transactions.json");
};

export const exportToCSV = (transactions: Transaction[]) => {
  if (transactions.length === 0) return;
  const headers = Object.keys(transactions[0]).join(",");
  const rows = transactions.map((t) =>
    [t.id, t.date, t.amount, `"${t.category}"`, t.type].join(",")
  );
  
  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  downloadBlob(blob, "transactions.csv");
};

export const exportToExcel = (transactions: Transaction[]) => {
  if (transactions.length === 0) return;
  const worksheet = xlsx.utils.json_to_sheet(transactions);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");
  
  xlsx.writeFile(workbook, "transactions.xlsx");
};
