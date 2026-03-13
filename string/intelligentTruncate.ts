
export default function intelligentTruncate(str: string, length: number, ellipsis: string = "...") {
  if (str.length <= length) return str;
  const index = str.lastIndexOf(" ", length - ellipsis.length + 1);
  if (index === -1) {
    return str.slice(0, length) + ellipsis;
  }
  return str.slice(0, index) + ellipsis;
}