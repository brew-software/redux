import { AnyAction, Reducer } from "redux";
import { deserialize, serialize } from "@brew-software/utilities";
import { StorageEngine, StorageOptions } from "./+types";

type StorageFactoryOptions<TState extends {}> = {
  key: string;
  storageEngine: StorageEngine;
  options: StorageOptions<TState>;
};

const storageFactory = <TState extends {}>({
  key,
  storageEngine,
  options,
}: StorageFactoryOptions<TState>) => {
  return (reducer: Reducer<TState, AnyAction>): Reducer<TState, AnyAction> => {
    return (state: TState | undefined, action: AnyAction) => {
      if (state === undefined) {
        const fromEngine = storageEngine.get(key);
        const value =
          typeof fromEngine !== "string" ? state : deserialize(fromEngine);

        const updated = Object.keys(options).reduce((state, key) => {
          const { valid, correct, defaults = undefined } = (options as any)[
            key
          ];
          const correctorFn =
            correct ||
            (valid && ((v: any, d: any) => (valid(v, d) ? v : d))) ||
            ((v: any, d: any) => (v === null || v === undefined ? d : v));
          const current = value ? value[key] : defaults;
          const corrected = correctorFn(current, defaults);

          (state as any)[key] = corrected;

          return state;
        }, {} as TState);

        state = updated;
      }

      const newState = reducer(state, action);
      const toPreserve =
        (newState &&
          Object.keys(options).reduce((state, key) => {
            (state as any)[key] = (newState as any)[key];
            return state;
          }, {})) ||
        false;

      storageEngine.save(key, serialize(toPreserve));

      return newState;
    };
  };
};

export default storageFactory;
