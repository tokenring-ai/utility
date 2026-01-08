/**
 * Detects if a buffer contains binary data by checking for null bytes
 * and other non-text characters in the first 8KB of the file
 */
export function isBinaryData(buffer: Buffer): boolean {
  // Check first 8KB for binary detection
  const sampleSize = Math.min(8192, buffer.length);
  const sample = buffer.subarray(0, sampleSize);

  // Check for null bytes (strong indicator of binary)
  if (sample.includes(0)) {
    return true;
  }

  // Check for high ratio of non-printable ASCII or non-UTF8 bytes
  let nonPrintableCount = 0;
  for (let i = 0; i < sampleSize; i++) {
    const byte = sample[i];
    // ASCII printable range: 32-126, plus tab (9), newline (10), carriage return (13)
    const isPrintable = (byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13;
    if (!isPrintable) {
      nonPrintableCount++;
    }
  }

  // If more than 30% of bytes are non-printable, consider it binary
  const nonPrintableRatio = nonPrintableCount / sampleSize;
  return nonPrintableRatio > 0.3;
}