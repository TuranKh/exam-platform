export default class DateUtils {
  static minToHour(min: number) {
    if (!min) {
      return;
    }
    const reminder = min % 60;
    const hours = (min - reminder) / 60;

    if (reminder && hours) {
      return `${hours} saat, ${reminder} dəq`;
    }

    if (reminder) {
      return `${reminder} dəq`;
    }

    return `${hours} saat`;
  }

  static getServerDate(date: Date) {
    if (!date) {
      return null;
    }
    const days = String(date.getDate()).padStart(2, "0");
    const months = String(date.getMonth() + 1).padStart(2, "0");
    const years = String(date.getFullYear()).padStart(4, "0");

    return `${years}-${months}-${days}`;
  }
}
