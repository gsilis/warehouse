import { createContext, useCallback, useState } from "react";

export const SHELF_ROWS = 2;
export const SHELF_COLUMNS = 5;

const INITIAL_VALUE = [0, 1, 2, 3, 4];

type BoxContextShape = {
  boxes: number[],
  toggleBox: (row: number, col: number, state: boolean) => void,
};

export const BoxContext = createContext<BoxContextShape>({
  boxes: INITIAL_VALUE,
  toggleBox: () => {},
});

export function BoxProvider({ children }: { children: any }) {
  const [boxes, setBoxes] = useState<number[]>(INITIAL_VALUE);
  const toggleBox = useCallback((row: number, col: number) => {
    const index = ((SHELF_COLUMNS * SHELF_ROWS) * row) + col;

    setBoxes(oldBoxes => {
      if (oldBoxes.indexOf(index) > -1) {
        return oldBoxes.filter(b => b !== index);
      } else {
        return [...oldBoxes, index];
      }
    });
  }, [setBoxes]);

  return (
    <BoxContext value={ { boxes, toggleBox } }>
      { children }
    </BoxContext>
  );
}