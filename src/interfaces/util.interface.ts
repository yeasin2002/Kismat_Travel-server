export type Prettify<T extends Record<any, any>> = {
  [K in keyof T]: T[K];
} & {};

export type Modify<T, R extends Partial<T>> = Omit<T, keyof R> & R;
