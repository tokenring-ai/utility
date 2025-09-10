//type ConstructedTypeOf<ClassType> = abstract new (...args: any[]) => ClassType;

export default class TypedRegistry<ClassType = any> {
  protected items = new Set<ClassType>()


  register = (...items: ClassType[] | ClassType[][]) => {
    for (const item of items.flat() as ClassType[]) {
      this.items.add(item);
    }
  }


  getItems = (): ClassType[] => {
    return Array.from(this.items);
  }

  getItemsByType = <R extends ClassType>(type: abstract new (...args: any[]) => R): R[] => {
    return Array.from(this.items).filter(
      (service) => service instanceof type
    ) as R[];
  }

  getFirstItemByType = <R extends ClassType>(type: abstract new (...args: any[]) => R): R | undefined => {
    return this.getItemsByType(type)?.[0];
  }

  requireFirstItemByType = <R extends ClassType>(type: abstract new (...args: any[]) => R): R => {
    const ret = this.getFirstItemByType(type);
    if (!ret) throw new Error(`Cannot find a service of type: ${type}`);
    return ret;
  }
}