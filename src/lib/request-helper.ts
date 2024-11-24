import DateUtils from "./date-utils";

export default class RequestHelper {
  static applyFilters(result: any, filters: Record<string, unknown>) {
    Object.entries(filters).map(([key, value]) => {
      const isDate = key === "createdAt";
      if (isDate) {
        const date = DateUtils.getServerDate(value as Date);
        result.eq(key, date);
      } else {
        result.like(key, value);
      }
    });

    return result;
  }
}
