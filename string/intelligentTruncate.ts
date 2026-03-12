
export default function intelligentTruncate(str: string, length: number) {
  if (str.length <= length) return str;
  const index = str.lastIndexOf(" ", length - 2);
  if (index === -1) {
    return str.slice(0, length) + "...";
  }
  return str.slice(0, index) + "...";
}