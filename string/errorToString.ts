
export default function errorToString(error: any) {
  if (error === null) return 'Error was null';
  if (error === undefined) return 'Error was undefined';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.stack ?? `${error.name}: ${error.message}`;
  return String(error);
}