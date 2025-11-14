import { useEffect, useMemo, useRef } from "react"
import { PerspectiveCamera, WebGLRenderer } from "three";
import { FillContainer } from "./fill-container";
import { WarehouseScene } from "./warehouse.scene";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export function Viewer() {
  const elementRef = useRef<HTMLDivElement>(null);
  const renderer = useMemo(() => {
    return new WebGLRenderer({ antialias: true });
  }, []);
  const camera = useMemo(() => {
    return new PerspectiveCamera();
  }, []);
  const fillContainer = useMemo(() => {
    return new FillContainer((dims: DOMRectReadOnly) => {
      renderer.setSize(dims.width, dims.height);
      camera.aspect = dims.width / dims.height;
      camera.updateProjectionMatrix();
    });
  }, [renderer, camera]);
  useEffect(() => {
    new WarehouseScene(renderer, camera);
  }, [renderer, camera]);
  useEffect(() => {
    const currentRef = elementRef.current;
    if (!currentRef) return;
    currentRef.appendChild(renderer.domElement);
    fillContainer.watch(currentRef);
    return () => {
      if (!renderer.domElement.parentElement) return;
      renderer.domElement.parentElement.removeChild(renderer.domElement);
      fillContainer.teardown();
    }
  }, [elementRef.current]);

  useEffect(() => {
    if (!camera || !renderer) return;
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.updateProjectionMatrix();
    controls.update();
  }, [camera, renderer]);

  return <>
    <div ref={ elementRef } className="flex-1 overflow-hidden"></div>
  </>;
}