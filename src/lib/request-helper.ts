import DateUtils from "./date-utils";

export default class RequestHelper {
  static applyFilters(result: any, filters: Record<string, unknown>) {
    Object.entries(filters).map(([key, value]) => {
      const isDate = key === "createdAt";
      if (isDate) {
        const date = DateUtils.getServerDate(value as Date);
        result.eq(key, date);
      } else {
        if (typeof value === "string") {
          const isBoolean = value === "true" || value === "false";
          const isNumber = !Number.isNaN(Number(value));
          const isNull = value === "null";

          if (isBoolean) {
            // boolean from select options
            result.eq(key, JSON.parse(value));
          } else if (isNumber) {
            result.eq(key, Number(value));
          } else if (isNull) {
            result.is(key, null);
          } else {
            result.ilike(key, `%${value.trim()}%`);
          }
        } else if (typeof value === "boolean") {
          result.eq(key, value);
        }
      }
    });

    return result;
  }
}
