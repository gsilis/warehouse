import { useContext, useEffect, useMemo, useRef } from "react"
import { PerspectiveCamera, WebGLRenderer } from "three";
import { FillContainer } from "./fill-container";
import { WarehouseScene } from "./warehouse.scene";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { aspectRatioFrom } from "./utilities/dom";
import { WorldSettingsContext, type SettingsShape } from "./contexts/world-settings-context";
import { GlobalSettings } from "./global-settings";

export function Viewer() {
  const initRef = useRef(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const settingsContext = useContext(WorldSettingsContext);

  const settings = useMemo(() => {
    return new GlobalSettings();
  }, []);

  useEffect(() => {
    if (initRef.current || !elementRef.current) return;
    initRef.current = true;

    const keys: (keyof SettingsShape)[] = [
      'lightHelpers',
      'planeHelpers',
      'testCube',
      'shadows',
    ];
    keys.forEach((name) => {
      settings.add(name, settingsContext[name]);
    });

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
    }, settings);
    dom.appendChild(renderer.domElement);
    container.watch(dom);
  }, [elementRef.current, initRef.current, settingsContext]);

  useEffect(() => settings.setValue('lightHelpers', settingsContext.lightHelpers), [settingsContext.lightHelpers]);
  useEffect(() => settings.setValue('planeHelpers', settingsContext.planeHelpers), [settingsContext.planeHelpers]);
  useEffect(() => settings.setValue('testCube', settingsContext.testCube), [settingsContext.testCube]);
  useEffect(() => settings.setValue('shadows', settingsContext.shadows), [settingsContext.shadows]);

  return <>
    <div ref={ elementRef } className="flex-1 overflow-hidden"></div>
  </>;
}