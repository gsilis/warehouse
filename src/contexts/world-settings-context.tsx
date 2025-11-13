import { createContext, useState } from "react";

type SettingsShape = {
  lightHelpers: boolean,
  testCube: boolean,
  planeHelpers: boolean,
};

type WorldSettingsContextShape = SettingsShape & {
  toggleLightHelpers: () => void,
  toggleTestCube: () => void,
  togglePlaneHelpers: () => void,
};

export const WorldSettingsContext = createContext<WorldSettingsContextShape>({
  lightHelpers: false,
  toggleLightHelpers: () => {},

  testCube: false,
  toggleTestCube: () => {},

  planeHelpers: false,
  togglePlaneHelpers: () => {},
});

export function WorldSettingsProvider({ children }: { children: any }) {
  const [settings, updateSettings] = useState<SettingsShape>({
    lightHelpers: false,
    testCube: false,
    planeHelpers: false,
  });

  const toggleLightHelpers = () => {
    updateSettings((old) => ({ ...old, lightHelpers: !old.lightHelpers }));
  };
  const toggleTestCube = () => {
    updateSettings(o => ({ ...o, testCube: !o.testCube }));
  };
  const togglePlaneHelpers = () => {
    updateSettings(o => ({ ...o, planeHelpers: !o.planeHelpers }));
  };

  const combinedSettings: WorldSettingsContextShape = {
    lightHelpers: settings.lightHelpers,
    toggleLightHelpers,

    testCube: settings.testCube,
    toggleTestCube,

    planeHelpers: settings.planeHelpers,
    togglePlaneHelpers,
  };

  return (
    <WorldSettingsContext value={ combinedSettings }>
      { children }
    </WorldSettingsContext>
  );
}