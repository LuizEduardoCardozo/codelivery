import { Controller, Get, Render } from '@nestjs/common';
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
}
