import { useContext, useEffect, useMemo, useRef } from "react"
import { BoxContext } from "./contexts/box-context";
import { WarehouseScene } from "./warehouse.scene";
import { WorldSettingsContext } from "./contexts/world-settings-context";

export function Viewer() {
  const elementRef = useRef<HTMLDivElement>(null);
  const boxContext = useContext(BoxContext);
  const scene = useMemo<WarehouseScene>(() => {
    return new WarehouseScene();
  }, []);
  const settingsContext = useContext(WorldSettingsContext);
  const resizeObserver = useMemo<ResizeObserver>(() => {
    return new ResizeObserver((es) => {
      for (const e of es) {
        if (!e.contentRect) {
          return;
        }

        scene.setDimensions(e.contentRect.width, e.contentRect.height);
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    // Dunno if this gets hoisted above the if block,
    // but this makes cleanup via the returned
    // function easier.
    const thisElement = elementRef.current;

    resizeObserver.observe(thisElement);

    return () => resizeObserver.unobserve(thisElement);
  }, [resizeObserver]);

  useEffect(() => {
    const ref = elementRef.current;
    if (!ref) return;

    ref.appendChild(scene.getCanvas());
  }, [JSON.stringify(boxContext.boxes)]);

  useEffect(() => {
    scene.lightHelpersEnabled = settingsContext.lightHelpers;
  }, [settingsContext.lightHelpers, scene]);

  useEffect(() => {
    scene.testBoxEnabled = settingsContext.testCube;
  }, [settingsContext.testCube, scene]);

  useEffect(() => {
    scene.start();
  }, []);

  return <div ref={ elementRef } className="flex-1 overflow-hidden">{ boxContext.boxes.join(', ') }</div>
}