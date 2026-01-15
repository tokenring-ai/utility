import {wrapText} from "./wrapText.ts";

/* --- Example Usage ---
const headers = ["ID", "Name", "Description"];
const rows = [
  ["1", "Alice", "A software engineer who loves TypeScript and building CLI tools."],
  ["2", "Bob", "A designer focused on minimalist UI/UX patterns."],
  ["3", "Charlie", "Enjoys long walks on the beach and debugging complex race conditions."]
];

const tableOutput = createAsciiTable([headers, ...rows], {
  columnWidths: [4, 10, 30],
  padding: 1
});

console.log(tableOutput);
*/

interface TableOptions {
  columnWidths: number[];
  padding?: number;
  header?: string[];
  grid?: boolean;
}

/**
 * Generates an ASCII table with wrapping and spacing.
 */
export function createAsciiTable(data: string[][], options: TableOptions): string {
  const { columnWidths, padding = 0, grid = false } = options;
  const pad = ' '.repeat(padding);

  // Helper to create a horizontal separator line
  const separator = grid
    ? '+' +
    columnWidths.map( (w) => '-'.repeat(w + padding * 2)).join('+') +
    '+\n'
    : '';

  const verticalSeparator = grid ? '|' : '';
  let table = separator;

  data.forEach((row) => {
    // Wrap each cell in the row
    const wrappedCells = row.map((cell, i) => wrapText(cell, columnWidths[i]));

    // Determine the height of the row (max lines in any cell)
    const rowHeight = Math.max(...wrappedCells.map(cellLines => cellLines.length));

    // Render the row line by line (for multi-line wrapped cells)
    for (let lineIdx = 0; lineIdx < rowHeight; lineIdx++) {
      let line = verticalSeparator;
      wrappedCells.forEach((cellLines, colIdx) => {
        const content = (cellLines[lineIdx] || '').trim();
        const width = columnWidths[colIdx];

        // Calculate filler based on the defined column width
        const filler = ' '.repeat(Math.max(0, width - content.length));

        // Standardize padding for all cells to match the separator logic
        line += `${pad}${content}${filler}${pad}${verticalSeparator}`;
      });
      table += line + '\n';
    }
    table += separator;
  });

  return table;
}