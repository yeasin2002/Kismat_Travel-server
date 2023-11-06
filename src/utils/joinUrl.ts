export function joinUrl(...args: string[]) {
  return args
    .map(url => url.replace(/^\/|\/$/g, ""))
    .filter(Boolean)
    .join("/");
}
