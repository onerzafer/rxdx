import { filter } from "rxjs/operators";
import { Subject, merge } from "rxjs";

export function ofType(...types) {
  return filter(action => types.includes(action.type));
}

export const actions$ = new Subject();

export const effectsMiddleware = (...effects) => {
  return storeGetter => {
    return next => {
      merge(...getActionsFromEffects(effects)).subscribe(action => {
        storeGetter().dispatch(action);
      });
      return action => {
        const result = next(action);
        actions$.next(action);
        return result;
      };
    };
  };
};

function getActionsFromEffects(effects) {
  return effects.reduce((cum, curr) => {
    Object.keys(curr)
      .map(key => curr[key])
      .filter(action$ => action$.type && action$.type === "effect")
      .forEach(action$ => cum.push(action$.subject));
    return cum;
  }, []);
}

export const Effect = config => (target) => {
  return {
    ...config,
    subject: target,
    type: "effect"
  };
};
