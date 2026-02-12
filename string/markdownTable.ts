/**
 * Generates a Markdown table string from columns and rows.
 *
 * @param columns - An array of strings representing the table headers.
 * @param rows - An array of arrays, where each inner array represents a row of data.
 * @returns A formatted Markdown table string.
 */
export default function markdownTable(columns: string[], rows: string[][]): string {
  if (columns.length === 0) return "";

  // Helper to create a row string
  const createRow = (cells: string[]) => `| ${cells.join(" | ")} |`;

  // 1. Create the header row
  const headerRow = createRow(columns);

  // 2. Create the separator row (e.g., | --- | --- |)
  const separatorRow = createRow(columns.map(() => "---"));

  // 3. Create the data rows
  const dataRows = rows.map(row => {
    // Ensure the row has the same number of cells as columns
    const padding = new Array(Math.max(0, columns.length - row.length)).fill("");
    const sanitizedRow = row.concat(padding).slice(0, columns.length);
    return createRow(sanitizedRow);
  });

  return [headerRow, separatorRow, ...dataRows].join("\n");
}