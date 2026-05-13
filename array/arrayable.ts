export type Arrayable<T> = T | T[];

export const arrayableToArray = <T>(value: Arrayable<T> | undefined): T[] => (Array.isArray(value) ? value : value === undefined ? [] : [value]);

export const firstOfArrayable = <T>(value: Arrayable<T> | undefined): T | undefined => (Array.isArray(value) ? value[0] : value);

export const lastOfArrayable = <T>(value: Arrayable<T> | undefined): T | undefined => (Array.isArray(value) ? value[value.length - 1] : value);

export const joinArrayable = (value: Arrayable<string>, separator: string): string => (Array.isArray(value) ? value.join(separator) : value);

export const splitArrayable = (value: Arrayable<string>, separator: string): string[] => (Array.isArray(value) ? value : value.split(separator));

//export const isArrayableEmpty = (value: Arrayable<any> | null | undefined): boolean => Array.isArray(value) ? value.length === 0 : value == null;
