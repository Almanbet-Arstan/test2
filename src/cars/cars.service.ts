import { Injectable, Inject } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';

@Injectable()
export class CarsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async getCars() {
    const res = await this.conn.query('SELECT * FROM cars');
    return res.rows;
  }

  async createCar(dto) {
    await this.conn.query(
      'INSERT INTO cars (model, number, status) VALUES ($1, $2, $3) RETURNING *',
      [dto.model, dto.number, dto.status],
    );
  }

  async deleteCar(dto) {
    await this.conn.query('DELETE FROM cars WHERE number = $1 RETURNING * ', [
      dto.number,
    ]);
  }
}
