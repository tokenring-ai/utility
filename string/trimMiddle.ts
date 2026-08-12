const OMITTED_MARKER = "...omitted...";

export default function trimMiddle(str: string, startLength: number, endLength: number) {
  str = str.trim();
  if (str.length <= startLength + endLength + OMITTED_MARKER.length) {
    return str;
  }

  return str.slice(0, startLength) + OMITTED_MARKER + str.slice(-endLength);
}
