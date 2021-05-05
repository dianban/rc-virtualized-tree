export function arrayEquals<T>(x: ReadonlyArray<T>, y: ReadonlyArray<T>) {
  if (x === y) {
    return true;
  }

  if (x.length !== y.length) {
    return false;
  }

  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) {
      return false;
    }
  }

  return true;
}

export function shallowEquals(x: any, y: any) {
  if (Object.is(x, y)) {
    return true;
  }

  if (
    x === null ||
    y === null ||
    typeof x !== "object" ||
    typeof y !== "object"
  ) {
    return false;
  }

  const xKeys = Object.keys(x);
  const yKeys = Object.keys(y);

  if (xKeys.length !== yKeys.length) {
    return false;
  }

  for (let i = 0; i < xKeys.length; i++) {
    const key = xKeys[i];
    if (
      !Object.prototype.hasOwnProperty.call(y, key) ||
      !Object.is(x[key], y[key])
    ) {
      return false;
    }
  }

  return true;
}
