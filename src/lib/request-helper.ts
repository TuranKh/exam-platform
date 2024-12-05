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
          if (value !== "true" && value !== "false") {
            result.ilike(key, value.trim());
          } else {
            // boolean from select options
            result.eq(key, JSON.parse(value));
          }
        } else if (typeof value === "boolean") {
          result.eq(key, value);
        } else {
          result.like(key, true);
        }
      }
    });

    return result;
  }
}
