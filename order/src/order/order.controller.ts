import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverHttpService } from 'src/driver-http/driver-http.service';
import { Repository } from 'typeorm';
import { Order } from './order.model';

@Controller('orders')
export class OrderController {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly driverService: DriverHttpService,
  ) {}

  @Get()
  @Render('order/index')
  async index() {
    const orders = await this.orderRepository.find({
      order: {
        created_at: 'ASC',
      },
    });
    return { data: orders };
  }

  @Get('/create')
  @Render('order/create')
  async create() {
    const drivers = await this.driverService.getDrivers();
    return { drivers };
  }

  @Post('')
  @Redirect('orders')
  async createOrder(@Body() { driver, location }) {
    const [locationId, locationGeo] = location.split('/');
    const [driverId, driverName] = driver.split(',');
    const [location_lat, location_lng] = locationGeo.split(',');
    const order = this.orderRepository.create({
      driver_id: driverId,
      driver_name: driverName,
      location_geo: [location_lat, location_lng],
      location_id: locationId,
    });
    await this.orderRepository.save(order);
  }
}
