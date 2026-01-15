export default function indent(input: string | string[], level: number): string {
  const lines = Array.isArray(input) ? input : input.split('\n');
  const indentString = ' '.repeat(level);

  return lines
    .map(line => line.trim())
    .map(line => line ? `${indentString}${line}` : '')
    .join('\n');
}