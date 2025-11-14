export function createArray(size: number, fill: any = undefined) {
  const arr = [];

  while (arr.length < size) {
    arr.push(fill);
  }

  return arr;
}

export function change(oldArray: boolean[], newArray: boolean[]): boolean[] {
  const arr: boolean[] = [];
  oldArray.forEach((_, i) => arr[i] = true);
  newArray.forEach((_, i) => arr[i] = true);

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) continue;

    if (oldArray[i] && newArray[i]) {
      delete arr[i];
    } else if (oldArray[i]) {
      arr[i] = false;
    } else if (newArray[i]) {
      arr[i] = true;
    }
  }

  return arr;
}

export function all(array: any[], value: any): boolean {
  let good = true;

  array.forEach(v => {
    if (v !== value) good = false;
  });

  return good;
}

export function sum(array: number[]): number {
  return array.reduce((acc, num) => acc + num, 0);
}