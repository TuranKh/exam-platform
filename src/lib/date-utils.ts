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
}
