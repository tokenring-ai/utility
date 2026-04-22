
export default function errorAsString(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return `Unknown error: ${JSON.stringify(error)}`;
  }
}
