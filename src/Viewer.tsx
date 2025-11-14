import { useEffect, useMemo, useRef } from "react"
import { WebGLRenderer } from "three";
import { FillContainer } from "./fill-container";
import { WarehouseScene } from "./warehouse.scene";

export function Viewer() {
  const elementRef = useRef<HTMLDivElement>(null);
  const renderer = useMemo(() => {
    return new WebGLRenderer({ antialias: true });
  }, []);
  useEffect(() => {
    if (!elementRef.current) return;
    const container = new FillContainer(renderer.domElement);
    container.watch(elementRef.current);
    return () => {
      container.teardown();
    };
  }, []);
  useEffect(() => {
    new WarehouseScene(renderer);
  }, [renderer]);
  useEffect(() => {
    const currentRef = elementRef.current;
    if (!currentRef) return;
    currentRef.appendChild(renderer.domElement);
    return () => {
      if (!renderer.domElement.parentElement) return;
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  }, [elementRef.current]);

  return <>
    <div ref={ elementRef } className="flex-1 overflow-hidden"></div>
  </>;
}