export const immutableSplice = (
  arr: any[],
  start: number,
  deleteCount: number,
  ...items: any
): any[] => {
  return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
};
