import { createContext, useCallback, useState } from "react";

export type SettingsShape = {
  lightHelpers: boolean,
  testCube: boolean,
  planeHelpers: boolean,
};

const defaultSettings: SettingsShape = {
  lightHelpers: false,
  testCube: false,
  planeHelpers: false,
};

type WorldSettingsContextShape = SettingsShape & {
  update: (key: keyof SettingsShape, value: boolean) => void,
};

export const WorldSettingsContext = createContext<WorldSettingsContextShape>({
  update: () => {},
  ...defaultSettings,
});

export function WorldSettingsProvider({ children }: { children: any }) {
  const [settings, updateSettings] = useState<SettingsShape>({
    lightHelpers: false,
    testCube: false,
    planeHelpers: false,
  });
  const update = useCallback((key: keyof SettingsShape, value: boolean) => {
    console.log(key, value);
    updateSettings((o) => {
      return {
        ...o,
        [key]: value,
      };
    });
  }, [updateSettings]);

  const combinedSettings: WorldSettingsContextShape = {
    lightHelpers: settings.lightHelpers,
    testCube: settings.testCube,
    planeHelpers: settings.planeHelpers,
    update,
  };

  return (
    <WorldSettingsContext value={ combinedSettings }>
      { children }
    </WorldSettingsContext>
  );
}