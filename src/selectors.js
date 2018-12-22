function isObjectEqual(a, b) {
  if (!a || !b) return false;
  for (let i in a) if (!(i in b)) return false;
  for (let i in b) {
    if (typeof a[i] === "object" && !isObjectEqual(a[i], b[i])) return false;
    if (
      typeof a[i] === "function" &&
      typeof b[i] !== "undefined" &&
      a[i].toStrig() !== b[i].toString()
    )
      return false;
    if (a[i] !== b[i]) return false;
  }
  for (let i in b) if (!(i in a)) return false;
  return true;
}

export const createSelector = (...args) => {
  let prevState = undefined;
  let prevResult = undefined;
  const projector = args[args.length - 1];
  const selectors = args
    .slice(0, args.length - 1)
    .reverse()
    .reduce((a, b) => (...args) => a(b(...args)), projector);
  return state => {
    if (!isObjectEqual(state, prevState)) {
      prevResult = selectors(state);
      prevState = { ...state };
    }
    return prevResult;
  };
};
