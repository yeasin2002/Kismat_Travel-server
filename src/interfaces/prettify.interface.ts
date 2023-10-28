export type Prettify<T extends Record<any, any>> = {
  [K in keyof T]: T[K];
} & {};
