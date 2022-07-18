import { parseTimeToMilliseconds } from './parseTimeToMilliseconds';

export function sortCarsWithBookingInfo(cars) {
  // сортируем машины
  const allCars = {};
  cars.forEach((cars) => {
    const carsId = cars.carid;
    !allCars.hasOwnProperty(carsId) // проверяет есть ли в массиве такая машина
      ? (allCars[carsId] = [cars])
      : (allCars[carsId] = [...allCars[carsId], cars]);
  });
  return Object.values(allCars).map((item) => {
    return getAllDaysInBooking(item);
  });
}

export function getAllDaysInBooking(car) {
  // всего дней в аренде
  const allSumDays = [];
  car.forEach((item) => {
    allSumDays.push(
      (parseTimeToMilliseconds(item.enddate) -
        parseTimeToMilliseconds(item.startdate)) /
        86400000,
    );
  });
  // процент дней в аренде за месяц
  const percent = Math.floor(
    (100 / 30) *
      allSumDays.reduce((acum, next) => {
        return acum + next;
      }, 0),
  );
  return { percent: percent, carID: car[0].carid };
}
