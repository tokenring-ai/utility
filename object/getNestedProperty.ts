export function getNestedProperty(obj: any, path: string): unknown {
  return path.split(".").reduce((current, prop) => {
    if (current && Object.hasOwn(current, prop)) {
      return current[prop];
    }
    return undefined;
  }, obj);
}
