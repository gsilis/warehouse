import { useContext } from "react";
import { ShelfControl } from "./ShelfControl";
import { BoxContext } from "./contexts/box-context";
import { FlagToggle } from "./FlagToggle";

export function Controls() {
  const boxContext = useContext(BoxContext);

  return <div className="bg-slate-950 overflow-scroll flex-[0_200px] md:flex-[0_500px] flex flex-col md:justify-center">
    <ShelfControl id={ 0 } boxes={ boxContext.boxes }>1</ShelfControl>
    <ShelfControl id={ 1 } boxes={ boxContext.boxes }>2</ShelfControl>
    <ShelfControl id={ 2 } boxes={ boxContext.boxes }>3</ShelfControl>
    <hr className="border-sky-400/20 mx-4 my-4" />
    <FlagToggle name={ 'lightHelpers' }>Light Helpers</FlagToggle>
    <FlagToggle name={ 'testCube' }>Test Cube</FlagToggle>
    <FlagToggle name={ 'planeHelpers' }>Plane Helpers</FlagToggle>
    <FlagToggle name={ 'shadows' }>Shadows</FlagToggle>
  </div>;
}