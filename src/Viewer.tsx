import { useEffect, useRef } from "react"
import { PerspectiveCamera, WebGLRenderer } from "three";
import { FillContainer } from "./fill-container";
import { WarehouseScene } from "./warehouse.scene";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { aspectRatioFrom } from "./utilities/dom";

export function Viewer() {
  const initRef = useRef(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initRef.current || !elementRef.current) return;
    initRef.current = true;

    const dom = elementRef.current;
    const renderer = new WebGLRenderer({ antialias: true });
    const camera = new PerspectiveCamera(75, aspectRatioFrom(dom));
    const controls = new OrbitControls(camera, dom);
    const container = new FillContainer((dims) => {
      renderer.setSize(dims.width, dims.height);
      camera.aspect = dims.width / dims.height;
      camera.updateProjectionMatrix();
    });
    new WarehouseScene(renderer, camera, () => {
      controls.update();
    });
    dom.appendChild(renderer.domElement);
    container.watch(dom);
  }, [elementRef.current, initRef.current]);

  return <>
    <div ref={ elementRef } className="flex-1 overflow-hidden"></div>
  </>;
}