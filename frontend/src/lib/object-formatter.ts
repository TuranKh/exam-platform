export default class ObjectFormatter {
  static removeNullishValues(obj?: Record<string, unknown>) {
    if (!obj) {
      return null;
    }

    let size = 0;
    for (const key in obj) {
      size += 1;
      if (
        obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === "" ||
        obj[key] === "null"
      ) {
        size -= 1;
        delete obj[key];
      }
    }

    if (size === 0) {
      return null;
    }

    return obj;
  }
}
