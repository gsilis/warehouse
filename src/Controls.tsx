import { useContext } from "react";
import { ShelfControl } from "./ShelfControl";
import { BoxContext } from "./contexts/box-context";
import { WorldSettingsContext } from "./contexts/world-settings-context";

export function Controls() {
  const boxContext = useContext(BoxContext);
  const settingsContext = useContext(WorldSettingsContext);

  return <div className="bg-slate-950 flex-[0_500px] flex flex-col justify-center">
    <ShelfControl id={ 0 } boxes={ boxContext.boxes }>1</ShelfControl>
    <ShelfControl id={ 1 } boxes={ boxContext.boxes }>2</ShelfControl>
    <ShelfControl id={ 2 } boxes={ boxContext.boxes }>3</ShelfControl>
    <hr className="border-sky-400/20 mx-4 my-4" />
    <button onClick={ settingsContext.toggleLightHelpers } className="p-1 mx-3 my-1 border-1 border-sky-400/40 rounded-md text-sky-400 cursor-pointer hover:border-sky-400/80 duration-300 transition-all">
      { settingsContext.lightHelpers ? 'Disable Light Helpers' : 'Enable Light Helpers' }
    </button>
    <button onClick={ settingsContext.toggleTestCube } className="p-1 mx-3 my-1 border-1 border-sky-400/40 rounded-md text-sky-400 cursor-pointer hover:border-sky-400/80 duration-300 transition-all">
      { settingsContext.testCube ? 'Disable Test Cube' : 'Enable Test Cube' }
    </button>
  </div>;
}