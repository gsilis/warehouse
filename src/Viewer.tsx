import { useContext, useEffect, useMemo, useRef } from "react"
import { BoxContext } from "./contexts/box-context";
import { WarehouseScene } from "./warehouse.scene";

export function Viewer() {
  const elementRef = useRef(null);
  const boxContext = useContext(BoxContext);
  const scene = useMemo<WarehouseScene>(() => {
    return new WarehouseScene();
  }, []);
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

  return <div ref={ elementRef } className="bg-blue-500 flex-1">{ boxContext.boxes.join(', ') }</div>
}