
export default function unknownAsError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  } else if (typeof error === 'string') {
    return new Error(error);
  } else {
    return new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
}