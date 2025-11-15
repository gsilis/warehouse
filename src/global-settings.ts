import { BehaviorSubject, type Observer, type Subscription } from "rxjs";

export class GlobalSettings {
  setting: Record<string, BehaviorSubject<any>> = {};

  add<T>(name: string, initialValue: T) {
    this.setting[name] = new BehaviorSubject<typeof initialValue>(initialValue);
  }

  setValue(name: string, value: any) {
    const subject = this.setting[name];
    if (!subject) {
      throw new Error(`No subject exists for '${name}'`);
    }
    subject.next(value);
  }

  subscribe<T>(name: string, sub: ((value: T) => void | Observer<T>)): Subscription {
    const subject = this.setting[name];
    
    if (!subject) {
      throw new Error(`No subject exists for '${name}'`);
    }

    return subject.subscribe(sub);
  }
}