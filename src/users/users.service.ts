import { Injectable, Inject } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async getUsers() {
    const res = await this.conn.query('SELECT * FROM users');
    return res.rows;
  }

  async createUser(dto) {
    await this.conn.query(
      'INSERT INTO users (login, email, password) VALUES ($1, $2, $3) RETURNING *',
      [dto.login, dto.email, dto.password],
    );
  }

  async deleteUser(dto) {
    await this.conn.query('DELETE FROM users WHERE login = $1 RETURNING * ', [
      dto.login,
    ]);
  }
}
