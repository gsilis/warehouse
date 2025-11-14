import { BehaviorSubject, type Observer, type Subscription } from "rxjs";
import type { SettingsShape } from "./contexts/world-settings-context";

export class GlobalSettings {
  setting: Record<string, BehaviorSubject<any>> = {};

  add<T>(name: (keyof SettingsShape), initialValue: T) {
    this.setting[name] = new BehaviorSubject<typeof initialValue>(initialValue);
  }

  setValue(name: (keyof SettingsShape), value: any) {
    const subject = this.setting[name];
    if (!subject) {
      throw new Error(`No subject exists for '${name}'`);
    }
    subject.next(value);
  }

  subscribe<T>(name: (keyof SettingsShape), sub: ((value: T) => void | Observer<T>)): Subscription {
    const subject = this.setting[name];
    
    if (!subject) {
      throw new Error(`No subject exists for '${name}'`);
    }

    return subject.subscribe(sub);
  }
}