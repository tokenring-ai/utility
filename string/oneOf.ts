export default function oneOf(str: string, ...args: string[]) {
  return args.includes(str);
}
