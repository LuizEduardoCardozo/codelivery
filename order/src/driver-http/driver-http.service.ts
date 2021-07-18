import { Injectable } from '@nestjs/common';
import Axios from 'axios';

@Injectable()
export class DriverHttpService {
  private readonly BASE_URL = process.env.MICRO_DRIVERS_URL;

  async getDrivers() {
    const { data } = await Axios.get(`${this.BASE_URL}/drivers`);
    return data;
  }
}
