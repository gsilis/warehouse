import { createContext, useCallback, useState } from "react";

export type SettingsShape = {
  lightHelpers: boolean,
  testCube: boolean,
  planeHelpers: boolean,
  shadows: boolean,
};

const defaultSettings: SettingsShape = {
  lightHelpers: false,
  testCube: false,
  planeHelpers: false,
  shadows: true,
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
    shadows: true,
  });
  const update = useCallback((key: keyof SettingsShape, value: boolean) => {
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
    shadows: settings.shadows,
    update,
  };

  return (
    <WorldSettingsContext value={ combinedSettings }>
      { children }
    </WorldSettingsContext>
  );
}