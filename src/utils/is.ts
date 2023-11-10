export function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isBetween(num: number, lowerLimit: number, upperLimit: number) {
  return num >= lowerLimit && num <= upperLimit;
}

export function isTValid(T: number, range: number) {
  const currentTime = Date.now();
  const min = range * 60 * 1000;

  return Math.abs(currentTime - T) <= min;
}
