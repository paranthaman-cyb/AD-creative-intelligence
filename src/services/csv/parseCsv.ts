import Papa from 'papaparse';

export interface CsvParseResult {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  errors: string[];
}

/**
 * Parses raw CSV string safely using PapaParse.
 * Handles quoted cells, commas, newlines, and strips whitespace.
 */
export function parseCsvString(csvString: string): Promise<CsvParseResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(csvString, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields ? results.meta.fields.filter(Boolean) : [];
        const rows = results.data.filter((row) => {
          // Filter out rows that are entirely empty or null
          return Object.values(row).some((val) => val !== null && val !== undefined && String(val).trim() !== '');
        });
        const errors = results.errors.map((err) => `Row ${err.row ?? 'unknown'}: ${err.message}`);

        resolve({
          headers,
          rows,
          totalRows: rows.length,
          errors,
        });
      },
      error: (error: Error) => {
        resolve({
          headers: [],
          rows: [],
          totalRows: 0,
          errors: [error.message],
        });
      },
    });
  });
}

/**
 * Parses a File object via FileReader or PapaParse.
 */
export function parseCsvFile(file: File): Promise<CsvParseResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields ? results.meta.fields.filter(Boolean) : [];
        const rows = results.data.filter((row) => {
          return Object.values(row).some((val) => val !== null && val !== undefined && String(val).trim() !== '');
        });
        const errors = results.errors.map((err) => `Row ${err.row ?? 'unknown'}: ${err.message}`);

        resolve({
          headers,
          rows,
          totalRows: rows.length,
          errors,
        });
      },
      error: (error: Error) => {
        resolve({
          headers: [],
          rows: [],
          totalRows: 0,
          errors: [error.message],
        });
      },
    });
  });
}
