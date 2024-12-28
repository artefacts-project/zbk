import { ZettelService } from "@artefacts/core";
import { Subject } from "rxjs";

const events = {
  clearDrafts: new Subject<void>(),
  openDraft: new Subject<string>(),
  createNewZettel: new Subject<ZettelService>()
};
type EventsDict = typeof events;

type DispatchFunction<T> = (value: T) => void;

type SubjectValueType<K extends keyof EventsDict = keyof EventsDict> =
  EventsDict[K] extends Subject<infer U> ? U : never;

type DispatchDict = {
  [K in keyof EventsDict]: DispatchFunction<SubjectValueType<K>>;
};

const dispatch: DispatchDict = Object.keys(events).reduce((acc, key) => {
  // @ts-ignore value: Argument of type '......' is not assignable to parameter of type 'never'.
  acc[key as keyof EventsDict] = (value) => events[key as keyof EventsDict].next(value); //TODO: can typing be improved?
  return acc;
}, {} as DispatchDict);

export { dispatch, events };
