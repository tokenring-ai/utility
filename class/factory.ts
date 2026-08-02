export default function classFactory<T extends new (...args: any[]) => any>(Class: T): (...args: ConstructorParameters<T>) => InstanceType<T> {
  return (...args) => new Class(...args);
}
