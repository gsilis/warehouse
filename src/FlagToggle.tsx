import { useContext } from "react";
import { WorldSettingsContext, type SettingsShape } from "./contexts/world-settings-context";

type FlagToggleShape = {
  name: keyof SettingsShape,
  children: any,
};

export function FlagToggle({
  name,
  children,
}: FlagToggleShape) {
  const settings = useContext(WorldSettingsContext);
  const status = settings[name] ? 'Disable' : 'Enable';
  const onClick = () => {
    settings.update(name, !settings[name]);
  };

  return <button onClick={ onClick } className="p-1 mx-3 my-1 border-1 border-sky-400/40 rounded-md text-sky-400 cursor-pointer hover:border-sky-400/80 duration-300 transition-all">
    { status } { children }
  </button>;
}