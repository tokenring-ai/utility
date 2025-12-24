/**
 * Wraps text into an array of strings based on max width.
 */
export function wrapText(text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(' ');
    let currentLine = '';

    words.forEach((word) => {
      if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxWidth) {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    lines.push(currentLine);
  });

  return lines;
}