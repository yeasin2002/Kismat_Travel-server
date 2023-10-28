import { createParamDecorator } from "routing-controllers";

const transform = {
  number: parserNumber,
  boolean: Boolean,
  string: (value: unknown) => `${value}`,
} as const;

interface DefaultQueryParamOptions<T> {
  defaultValue?: T;
  transform?: ((value: unknown) => T) | keyof typeof transform;
}

function parserNumber(value: unknown, fallback = 0) {
  const num = parseFloat(value + "");
  if (isNaN(num)) return fallback;
  return num;
}

export function QueryParam<T>(paramName: string, options?: DefaultQueryParamOptions<T>) {
  return createParamDecorator({
    value: action => {
      const value = action.request.query[paramName];
      if (value === undefined && options.defaultValue) return options.defaultValue;
      if (options.transform) {
        if (typeof options.transform === "function") return options.transform(value);
        return transform[options.transform](value);
      }
      return value;
    },
  });
}
