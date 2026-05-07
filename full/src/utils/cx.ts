// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cx(...classes: any[]): string {
  return classes.filter(Boolean).join(" ");
}
