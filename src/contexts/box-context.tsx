import { createContext, useCallback, useState } from "react";

export const SHELF_ROWS = 2;
export const SHELF_COLUMNS = 5;

type BoxContextShape = {
  boxes: boolean[],
  toggleBox: (row: number, col: number, state: boolean) => void,
};

export const BoxContext = createContext<BoxContextShape>({
  boxes: [],
  toggleBox: () => {},
});

export function BoxProvider({ children }: { children: any }) {
  const [boxes, setBoxes] = useState<boolean[]>([]);
  const toggleBox = useCallback((row: number, col: number, state: boolean) => {
    const index = ((SHELF_COLUMNS * SHELF_ROWS) * row) + col;
    setBoxes(oldBoxes => {
      const newArray = [...oldBoxes];
      newArray[index] = state;

      return newArray;
    });
  }, [setBoxes]);

  return (
    <BoxContext value={ { boxes, toggleBox } }>
      { children }
    </BoxContext>
  );
}