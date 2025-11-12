import { useContext } from "react";
import { Box } from "./Box";
import { createArray } from "./utilities/array";
import { BoxContext, SHELF_COLUMNS, SHELF_ROWS } from "./contexts/box-context";

// Because of how tailwind works, if you concat these
// values, it won't inject the CSS that makes them
// work.
const containerClassName = [
  'grid-rows-2',
  'grid-cols-5',
  'flex-1',
  'grid',
  'gap-4'
].join(' ');

type ShelfControlProps = {
  id: number,
  boxes?: number[],
  children?: any,
};

const turns = createArray(SHELF_ROWS * SHELF_COLUMNS);

export function ShelfControl({
  id,
  boxes = [],
  children,
}: ShelfControlProps) {
  const boxContext = useContext(BoxContext);
  const onToggle = (column: number, state: boolean) => {
    boxContext.toggleBox(id, column, state);
  }

  return <div className="flex my-3 items-center p-3 transition-all duration-1000 rounded-xl border-1 border-black/0 hover:border-1 hover:border-sky-300/20 mx-2 text-sky-300">
    <div className={ containerClassName }>
      { turns.map((_, index) => {
        const boxIndex = ((SHELF_COLUMNS * SHELF_ROWS) * id) + index;
        const state = boxes.includes(boxIndex);

        return <Box id={ index + 1 } key={ index } onToggle={ (state) => onToggle(index, state) } occupied={ state } />;
      }) }
    </div>
    <div className="text-center flex-[0_100px]">
      <span>SHELF</span>
      <br />
      <span className="text-2xl font-bold">{ children }</span>
    </div>
  </div>;
}