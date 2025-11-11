import { createContext, useState } from "react";

type SettingsShape = {
  lightHelpers: boolean,
  testCube: boolean,
};

type WorldSettingsContextShape = SettingsShape & {
  toggleLightHelpers: () => void,
  toggleTestCube: () => void,
};

export const WorldSettingsContext = createContext<WorldSettingsContextShape>({
  lightHelpers: false,
  toggleLightHelpers: () => {},

  testCube: false,
  toggleTestCube: () => {},
});

export function WorldSettingsProvider({ children }: { children: any }) {
  const [settings, updateSettings] = useState<SettingsShape>({
    lightHelpers: false,
    testCube: false,
  });

  const toggleLightHelpers = () => {
    updateSettings((old) => ({ ...old, lightHelpers: !old.lightHelpers }));
  };
  const toggleTestCube = () => {
    updateSettings(o => ({ ...o, testCube: !o.testCube }));
  };

  const combinedSettings: WorldSettingsContextShape = {
    lightHelpers: settings.lightHelpers,
    toggleLightHelpers,

    testCube: settings.testCube,
    toggleTestCube,
  };

  return (
    <WorldSettingsContext value={ combinedSettings }>
      { children }
    </WorldSettingsContext>
  );
}