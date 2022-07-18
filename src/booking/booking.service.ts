import { Injectable, Inject } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { checkStartDayAndEndDay } from '../utils/checkStartDayAndEndDay';
import { sumAllRentDays } from '../utils/sumAllRentDays';
import { sortCarsWithBookingInfo } from '../utils/sortCarsWithBookingInfo';
import { parseTimeToMilliseconds } from '../utils/parseTimeToMilliseconds';

@Injectable()
export class BookingsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async getAllBookings() {
    try {
      return this.conn.query('SELECT * FROM bookings');
    } catch (e) {
      return e.message;
    }
  }

  async createBooking(dto) {
    try {
      // проверка интервала 3 дня
      const checkClient = await this.checkUserBooking(
        dto.userId,
        dto.startDate,
      );
      // проверка на будние дни
      const checkDate = checkStartDayAndEndDay(dto.startDate, dto.endDate);
      //проверка на бронь машины больше чем на 30 дней
      const checkFreeDay = await this.checkCarsOnDate(
        dto.carId,
        dto.startDate,
        dto.endDate,
      );

      if (!checkDate.data && !checkFreeDay) {
        return checkDate.message + ' ' + checkFreeDay;
      } else if (checkDate.data && !checkFreeDay) {
        return checkFreeDay;
      } else if (!checkDate.data && checkFreeDay) {
        return checkDate.message;
      } else if (checkDate.data && checkFreeDay) {
        if (!checkClient) {
          return checkClient;
        }
        const rentSum = sumAllRentDays(dto.startDate, dto.endDate);
        this.conn.query(
          'INSERT INTO bookings (userId, carId, startDate, endDate) VALUES ($1, $2, $3, $4) RETURNING *',
          [dto.userId, dto.carId, dto.startDate, dto.endDate],
        );
        return rentSum;
      }
    } catch (e) {
      return e.message;
    }
  }

  async checkBooking(carId) {
    //метод который проверяет является ли машина забронированной или нет
    const { id } = carId;
    if (id > 5) {
      return 'Нет машины с id ' + id;
    }
    try {
      const response = await this.conn.query(
        'SELECT * FROM bookings WHERE carId = $1',
        [id],
      );
      return response.rows.length <= 0; //если машина свободна то возрващает тру
    } catch (e) {
      return e.message;
    }
  }

  async deleteBooking(bookingId) {
    const { id } = bookingId;
    try {
      const result = await this.conn.query(
        'DELETE FROM booking WHERE id = $1',
        [id],
      );
      if (result.rowCount === 0) {
        return `Reservation with id ${id} not found`;
      }
      return 'Reservation deleted';
    } catch (e) {
      return e.message;
    }
  }

  async getAllCarsBookingInfo() {
    // получаем информацию про каждую бронь машины
    const allCars = await this.conn.query(
      `SELECT * FROM bookings ORDER BY id ASC`,
    );

    const allReport = sortCarsWithBookingInfo(allCars.rows);
    return allReport;
  }

  async checkCarsOnDate(carId, start, end) {
    const cars = await this.conn.query(
      'SELECT * FROM bookings WHERE carId = $1',
      [carId],
    );
    let startDateCheck;
    let endDateCheck;
    let startCheck;
    let endCheck;
    if (cars.rows.length <= 0) {
      return 'Car is free';
    } else {
      //если забронирована
      for (let i = 0; i < cars.rows.length; i++) {
        //проходимся по броням
        const startDate = cars.rows[i].startDate;
        const endDate = cars.rows[i].endDate;
        startDateCheck = parseTimeToMilliseconds(startDate); // в милисекунды переводим время начала брони на которое было забронировано
        endDateCheck = parseTimeToMilliseconds(endDate); // в милисекунды переводим время конца брони на которое было забронировано
        startCheck = parseTimeToMilliseconds(start); // в милисекунды переводим время начала брони
        endCheck = parseTimeToMilliseconds(end); // в милисекунды переводим время конца брони
        if (startCheck >= startDateCheck && startCheck <= endDateCheck) {
          return 'Нельзя забронировать машину в это время';
        } else if (endCheck >= startDateCheck && endCheck <= endDateCheck) {
          return 'Нельзя забронировать машину в это время';
        }
      }
      if (
        startCheck < startDateCheck ||
        (startCheck > endDateCheck && endCheck < startDateCheck) ||
        (endCheck > endDateCheck && endCheck - startCheck <= 2592000000)
      ) {
        return { data: true, message: 'Машина свободна' };
      } else {
        return {
          data: false,
          message: 'Нельзя забронировать машину больше 30 дней',
        };
      }
    }
  }

  async checkUserBooking(userId, start) {
    // проверяем чтобы интервал был в 3 дня
    const users = await this.conn.query(
      'SELECT * FROM bookings WHERE userId = $1',
      [userId],
    );
    if (users.rows.length <= 0) {
      return 'Нет брони данного юзера';
    } else {
      const getLastBooking = users.rows[users.rows.length - 1]; // получаем последнюю бронь юзера
      const { enddate } = getLastBooking;
      const endDate = parseTimeToMilliseconds(enddate);
      const startCheck = parseTimeToMilliseconds(start);
      const different = startCheck - endDate;
      if (different < 86400000) {
        return 'Должно быть не меньше трех дней между бронированиями';
      } else {
        return 'Можно забронировать';
      }
    }
  }
}

// export class BookingService {
//   static async getAllReservations(req, res) {
//     try {
//       pool.query(
//         'SELECT * FROM reservation ORDER BY id ASC',
//         (error, results) => {
//           if (error) {
//             throw error;
//           }
//           res.status(200).json(results.rows);
//         },
//       );
//     } catch (e) {
//       return res.status(500).json({ message: e.message });
//     }
//   }
//   static async createReservation(req, res) {
//     try {
//       const { client_id, car_id, startDate, endDate } = req.body;
//       const checkDate = await checkStartDayAndEndDay(startDate, endDate);
//       const checkFreeDay = await checkCarsOnDate(car_id, startDate, endDate);
//       const checkClient = await checkClientReservation(client_id, startDate);
//
//       if (!checkDate.data && !checkFreeDay.data) {
//         return res
//           .status(400)
//           .json(checkDate.message + ' ' + checkFreeDay.message);
//       } else if (checkDate.data && !checkFreeDay.data) {
//         return res.status(400).json(checkFreeDay.message);
//       } else if (!checkDate.data && checkFreeDay.data) {
//         return res.status(400).json(checkDate.message);
//       } else if (checkDate.data && checkFreeDay.data) {
//         if (!checkClient.data) {
//           return res.status(400).json(checkClient.message);
//         }
//         const rentSum = sumAllRentDays(startDate, endDate);
//         const result = await pool.query(
//           'INSERT INTO reservation (clientId, carId, startDate, endDate) VALUES ($1, $2, $3, $4) RETURNING *',
//           [client_id, car_id, startDate, endDate],
//         );
//         res.json({ data: result.rows[0], rentSum: rentSum });
//       }
//     } catch (e) {
//       return res.status(500).json({ message: e.message });
//     }
//   }
//   static async checkReservation(req, res) {
//     const { id } = req.params;
//     if (id > 5) {
//       return res.status(404).join('Нет машины с id ' + id);
//     }
//     try {
//       const response = await pool.query(
//         'SELECT * FROM reservation WHERE carId = $1',
//         [id],
//       );
//       if (response.rows.length <= 0) {
//         return res.status(200).json(`Car with id ${id} is free`);
//       } else {
//         return res.status(200).json(response.rows);
//       }
//     } catch (e) {
//       return res.status(500).json({ message: e.message });
//     }
//   }
//   static async deleteReservation(req, res) {
//     const { id } = req.params;
//     try {
//       const result = await pool.query('DELETE FROM reservation WHERE id = $1', [
//         id,
//       ]);
//       if (result.rowCount === 0) {
//         return res
//           .status(404)
//           .json({ message: `Reservation with id ${id} not found` });
//       }
//       return res.status(200).json({ message: 'Reservation deleted' });
//     } catch (e) {
//       return res.status(500).json({ message: e.message });
//     }
//   }
//
//   static async getAllCarsReservationInfo(req, res) {
//     const allCars = await pool.query(
//       `SELECT * FROM reservation ORDER BY id ASC`,
//     );
//
//     const allReport = sortCarsWithReservationInfo(allCars.rows);
//     return res.json(allReport);
//   }
// }
// const checkCarsOnDate = async (carId, start, end) => {
//   const cars = await pool.query('SELECT * FROM reservation WHERE carId = $1', [
//     carId,
//   ]);
//   let startDateCheck;
//   let endDateCheck;
//   let startCheck;
//   let endCheck;
//   if (cars.rows.length <= 0) {
//     return { data: true, message: 'Car is free' };
//   } else {
//     for (let i = 0; i < cars.rows.length; i++) {
//       const { startdate, enddate } = cars.rows[i];
//       startDateCheck = parseTimeToMilliseconds(startdate);
//       endDateCheck = parseTimeToMilliseconds(enddate);
//       startCheck = parseTimeToMilliseconds(start);
//       endCheck = parseTimeToMilliseconds(end);
//       if (startCheck >= startDateCheck && startCheck <= endDateCheck) {
//         return {
//           data: false,
//           message: 'Нельзя забронировать машину в это время',
//         };
//       } else if (endCheck >= startDateCheck && endCheck <= endDateCheck) {
//         return {
//           data: false,
//           message: 'Нельзя забронировать машину в это время',
//         };
//       }
//     }
//     if (
//       startCheck < startDateCheck ||
//       (startCheck > endDateCheck && endCheck < startDateCheck) ||
//       (endCheck > endDateCheck && endCheck - startCheck <= 2592000000)
//     ) {
//       return { data: true, message: 'Машина свободна' };
//     } else {
//       return {
//         data: false,
//         message: 'Нельзя забронировать машину больше 30 дней',
//       };
//     }
//   }
// };
// async function checkClientReservation(clientId, start, end) {
//   const clients = await pool.query(
//     'SELECT * FROM reservation WHERE clientId = $1',
//     [clientId],
//   );
//   if (clients.rows.length <= 0) {
//     return { data: true, message: 'Нет резервов на данный авто' };
//   } else {
//     const getLastReservation = clients.rows[clients.rows.length - 1];
//     const { enddate } = getLastReservation;
//     const endDate = parseTimeToMilliseconds(enddate);
//     const startCheck = parseTimeToMilliseconds(start);
//     const different = startCheck - endDate;
//     if (different < 86400000) {
//       return {
//         data: false,
//         message: 'Должно быть не меньше трех дней между бронированиями',
//       };
//     } else {
//       return { data: true, message: 'Можно забронировать' };
//     }
//   }
// }
