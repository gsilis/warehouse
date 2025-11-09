export function createArray(size: number, fill: any = undefined) {
  const arr = [];

  while (arr.length < size) {
    arr.push(fill);
  }

  return arr;
}