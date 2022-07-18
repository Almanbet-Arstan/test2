import { checkWeekdays } from './checkWeekdays';
import { parseTimeToMilliseconds } from './parseTimeToMilliseconds';
//проверяет на начало дня бронирования и конец дня бронирования
export function checkStartDayAndEndDay(startDay, endDay) {
  const startDayNumber = checkWeekdays(parseTimeToMilliseconds(startDay)); //проверяет чтобы совпадало в будние дни
  const endDayNumber = checkWeekdays(parseTimeToMilliseconds(endDay)); //проверяет чтобы совпадало в будние дни
  if (!startDayNumber && !endDayNumber) {
    //возвращает false если не в будние дни
    return {
      data: false,
      message: 'Начало и конец аренды должно быть в будние дни',
    };
  } else if (!startDayNumber && endDayNumber) {
    return { data: false, message: 'Начало аренды должно быть в будние дни' };
  } else if (startDayNumber && !endDayNumber) {
    return { data: false, message: 'Конец аренды должно быть в будние дни' };
  } else {
    return { data: true, message: 'Аренда возможна' };
  }
}
